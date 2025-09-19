"use client"

import { useEffect, useRef, useState } from "react"

interface MapContainerProps {
  center: [number, number]
  coordinates: [number, number][]
  onCoordinatesChange: (coords: [number, number][]) => void
  isDrawing: boolean
  onDrawingChange: (drawing: boolean) => void
  className?: string
}

export function MapContainer({
  center,
  coordinates,
  onCoordinatesChange,
  isDrawing,
  onDrawingChange,
  className = "",
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = () => setIsLoaded(true)
        document.head.appendChild(script)
      } else {
        setIsLoaded(true)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    const L = (window as any).L

    // Initialize map
    const map = L.map(mapRef.current).setView(center, 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Store map instance
    mapInstanceRef.current = map

    // Add click handler for drawing
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      const newCoord: [number, number] = [lat, lng]

      onCoordinatesChange([...coordinates, newCoord])
      onDrawingChange(true)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded])

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, 13)
    }
  }, [center])

  // Update markers and polygon when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    const L = (window as any).L
    const map = mapInstanceRef.current

    // Clear existing layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer)
      }
    })

    // Add markers for each coordinate
    coordinates.forEach((coord, index) => {
      const marker = L.marker(coord, {
        icon: L.divIcon({
          className: "custom-marker",
          html: `<div style="background: #059669; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })
      marker.addTo(map)
    })

    // Draw polygon if we have at least 3 points
    if (coordinates.length >= 3) {
      const polygon = L.polygon(coordinates, {
        color: "#059669",
        fillColor: "#10b981",
        fillOpacity: 0.2,
        weight: 2,
      })
      polygon.addTo(map)

      // Fit map to polygon bounds
      map.fitBounds(polygon.getBounds(), { padding: [20, 20] })
    } else if (coordinates.length > 1) {
      // Draw polyline for incomplete polygon
      const polyline = L.polyline(coordinates, {
        color: "#059669",
        weight: 2,
        dashArray: "5, 5",
      })
      polyline.addTo(map)
    }
  }, [coordinates, isLoaded])

  return (
    <div className={`w-full h-full min-h-[500px] ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
