// components/FarmMap.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMap, useMapEvents, LayersControl } from "react-leaflet";
import { LatLngExpression, LatLng, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Props Interface ---
interface FarmMapProps {
  center: LatLngExpression;
  zoom: number;
  points: LatLng[];
  isPolygonClosed: boolean;
  onMapClick: (latlng: LatLng) => void;
}

// --- Helper Components ---
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// --- Main Map Component ---
export default function FarmMap({ center, zoom, points, isPolygonClosed, onMapClick }: FarmMapProps) {
  const polygonPositions = points.map(p => [p.lat, p.lng] as [number, number]);

  // Custom marker icon for farm boundary points
  const boundaryIcon = divIcon({
    className: 'custom-boundary-marker',
    html: '<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  return (
    <div className="h-full w-full relative">
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          z-index: 0;
        }
        .leaflet-control-container {
          font-family: inherit;
        }
        .leaflet-control-layers {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .custom-boundary-marker {
          background: transparent !important;
          border: none !important;
        }
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
          {/* Satellite View (Default) */}
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          
          {/* Hybrid View (Satellite + Labels) */}
          <LayersControl.BaseLayer name="Hybrid">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={20}
            />
            <TileLayer
              attribution=""
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          
          {/* Street Map */}
          <LayersControl.BaseLayer name="Street">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          
          {/* Topographic */}
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapClickHandler onMapClick={onMapClick} />
        
        {/* Boundary Point Markers */}
        {points.map((point, index) => (
          <Marker 
            key={index} 
            position={point} 
            icon={boundaryIcon}
          />
        ))}
        
        {/* Farm Boundary Polygon */}
        {points.length > 1 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={
              isPolygonClosed
                ? { 
                    color: '#22c55e', 
                    fillColor: '#22c55e', 
                    fillOpacity: 0.3,
                    weight: 3,
                    opacity: 0.8
                  }
                : { 
                    color: '#3b82f6', 
                    fillColor: '#3b82f6', 
                    fillOpacity: 0.1,
                    weight: 2,
                    opacity: 0.7,
                    dashArray: '5, 5'
                  }
            }
          />
        )}
      </MapContainer>
    </div>
  );
}