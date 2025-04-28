"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction } from "react";
import L from "leaflet";

// Fix marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapPickerProps {
  position: { lat: number; lng: number };
  setPosition: any
}

function LocationMarker({
  setPosition,
}: {
  setPosition: MapPickerProps["setPosition"];
}) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPicker({ position, setPosition }: MapPickerProps) {
  const handleDragEnd = (e: any) => {
    const marker = e.target;
    const latLng = marker.getLatLng();
    setPosition({ lat: latLng.lat, lng: latLng.lng });
  };

  return (
    <div className="w-2/3 h-[600px] rounded-md overflow-hidden border">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[position.lat, position.lng]}
          draggable={true}
          eventHandlers={{
            dragend: handleDragEnd,
          }}
        />
        <LocationMarker setPosition={setPosition} />
      </MapContainer>

      {/* Showing live coordinates */}
      <div className="p-2 bg-white shadow rounded-b-md text-sm">
        📍 Selected Location: {position.lat.toFixed(5)},{" "}
        {position.lng.toFixed(5)}
      </div>
    </div>
  );
}
