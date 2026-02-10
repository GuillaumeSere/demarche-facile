"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 1. Correction impérative des icônes Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Mairie = {
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  city?: string;
  postcode?: string;
};

type Props = {
  lat: number;
  lon: number;
  mairies?: Mairie[];
};

// 2. Le "Cerveau" de la carte : il force le déplacement quand lat/lon changent
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Map({ lat, lon, mairies = [] }: Props) {
    console.log("Mairies reçues par la Map :", mairies);
  return (
    <div className="h-96 w-full relative">
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0 rounded"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* On active le changement de vue dynamique */}
        <ChangeView center={[lat, lon]} />

        {/* Marqueur Utilisateur */}
        <Marker position={[lat, lon]}>
          <Popup>Vous êtes ici</Popup>
        </Marker>

        {/* Marqueurs Mairies */}
        {mairies.map((mairie, idx) => (
          <Marker key={idx} position={[mairie.latitude, mairie.longitude]}>
            <Popup>
              <div className="min-w-48">
                <p className="font-bold text-blue-700">{mairie.nom}</p>
                <p className="text-sm text-gray-600 italic">{mairie.adresse}</p>
                {mairie.city && (
                  <p className="text-xs text-gray-500 mt-2">
                    {mairie.city} {mairie.postcode && `- ${mairie.postcode}`}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}