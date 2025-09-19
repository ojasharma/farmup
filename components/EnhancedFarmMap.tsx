"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMap, LayersControl } from "react-leaflet";
import { LatLngExpression, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers which can sometimes be broken in React
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Type Definitions ---
interface CropZone {
  id: string;
  cropName: string;
  color: string;
  points: Array<{ lat: number; lng: number }>;
  area: number;
  percentage: number;
}

interface EnhancedFarmMapProps {
  center: LatLngExpression;
  zoom: number;
  farmBoundary: Array<{ lat: number; lng: number }>;
  cropZones?: CropZone[];
  showLabels?: boolean;
}

// --- Helper Component to Update Map View ---
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// --- Main Enhanced Farm Map Component ---
export default function EnhancedFarmMap({
  center,
  zoom,
  farmBoundary,
  cropZones = [],
  showLabels = true
}: EnhancedFarmMapProps) {

  // Convert farm boundary points to the format required by Leaflet's Polygon
  const farmBoundaryPositions = farmBoundary.map(p => [p.lat, p.lng] as [number, number]);

  // Generate dummy crop zones if no real data is provided
  const generateDummyCropZones = (boundary: Array<{ lat: number; lng: number }>): CropZone[] => {
    if (boundary.length < 3) return [];
    
    // Simple logic to create some sample zones within the farm boundary
    const centerLat = boundary.reduce((sum, p) => sum + p.lat, 0) / boundary.length;
    const centerLng = boundary.reduce((sum, p) => sum + p.lng, 0) / boundary.length;
    const minLat = Math.min(...boundary.map(p => p.lat));
    const minLng = Math.min(...boundary.map(p => p.lng));

    return [
      {
        id: 'wheat', cropName: 'Winter Wheat', color: '#F59E0B', area: 2.5, percentage: 40,
        points: [ { lat: minLat, lng: minLng }, { lat: minLat, lng: centerLng }, { lat: centerLat, lng: centerLng }, { lat: centerLat, lng: minLng }]
      },
      {
        id: 'corn', cropName: 'Sweet Corn', color: '#10B981', area: 2.0, percentage: 35,
        points: [ { lat: minLat, lng: centerLng }, { lat: minLat, lng: Math.max(...boundary.map(p => p.lng)) }, { lat: centerLat, lng: Math.max(...boundary.map(p => p.lng)) }, { lat: centerLat, lng: centerLng }]
      },
      {
        id: 'vegetables', cropName: 'Mixed Vegetables', color: '#8B5CF6', area: 1.5, percentage: 25,
        points: [ { lat: centerLat, lng: minLng }, { lat: centerLat, lng: Math.max(...boundary.map(p => p.lng)) }, { lat: Math.max(...boundary.map(p => p.lat)), lng: Math.max(...boundary.map(p => p.lng)) }, { lat: Math.max(...boundary.map(p => p.lat)), lng: minLng }]
      }
    ];
  };

  const zonesData = cropZones.length > 0 ? cropZones : generateDummyCropZones(farmBoundary);

  // Function to create a custom HTML label for a crop zone
  const createCropLabel = (zone: CropZone) => {
    return divIcon({
      className: 'crop-zone-label',
      html: `
        <div style="
          background: ${zone.color}; 
          color: white; 
          padding: 4px 8px; 
          border-radius: 12px; 
          font-size: 11px; 
          font-weight: bold;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 2px solid white;
          white-space: nowrap;
        ">
          ${zone.cropName}<br>
          <span style="font-size: 10px; opacity: 0.9;">
            ${zone.area.toFixed(1)}ha (${zone.percentage}%)
          </span>
        </div>
      `,
      iconSize: [80, 40], // Auto-size based on content
      iconAnchor: [40, 20],
    });
  };

  return (
    <div className="h-full w-full relative">
      <style jsx global>{`
        .leaflet-container { height: 100%; width: 100%; z-index: 0; }
        .leaflet-control-container { font-family: inherit; }
        .leaflet-control-layers { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.3); }
        .crop-zone-label, .boundary-marker { background: transparent !important; border: none !important; }
      `}</style>
      
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer attribution='&copy; <a href="https://www.esri.com/">Esri</a>' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={20}/>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Hybrid">
            <TileLayer attribution='&copy; <a href="https://www.esri.com/">Esri</a>' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={20}/>
            <TileLayer attribution="" url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" maxZoom={20}/>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19}/>
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Render Main Farm Boundary */}
        <Polygon
          positions={farmBoundaryPositions}
          pathOptions={{ color: '#ffffff', fillColor: 'transparent', weight: 4, opacity: 0.9, dashArray: '10, 5' }}
        />

        {/* Render Crop Zones and Their Labels */}
        {zonesData.map((zone) => {
          const zonePositions = zone.points.map(p => [p.lat, p.lng] as [number, number]);
          const zoneCenterLat = zone.points.reduce((sum, p) => sum + p.lat, 0) / zone.points.length;
          const zoneCenterLng = zone.points.reduce((sum, p) => sum + p.lng, 0) / zone.points.length;

          return (
            <div key={zone.id}>
              <Polygon
                positions={zonePositions}
                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.4, weight: 2 }}
              />
              {showLabels && (
                <Marker 
                  position={[zoneCenterLat, zoneCenterLng]}
                  icon={createCropLabel(zone)}
                />
              )}
            </div>
          );
        })}

        {/* Render Markers at Each Corner of the Farm Boundary */}
        {farmBoundary.map((point, index) => (
          <Marker 
            key={`boundary-marker-${index}`} 
            position={point}
            icon={divIcon({
              className: 'boundary-marker',
              html: '<div style="background-color: #374151; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              iconSize: [8, 8],
              iconAnchor: [4, 4],
            })}
          />
        ))}

      </MapContainer>
    </div>
  );
}