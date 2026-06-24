"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DefaultIcon = L.divIcon({
  className: "",
  html: `
    <span style="
      display:block;
      width:24px;
      height:24px;
      border-radius:999px 999px 999px 0;
      transform:rotate(-45deg);
      background:#2563eb;
      border:3px solid #ffffff;
      box-shadow:0 8px 20px rgba(15, 23, 42, .28);
    ">
      <span style="
        display:block;
        width:8px;
        height:8px;
        margin:5px;
        border-radius:999px;
        background:#ffffff;
      "></span>
    </span>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -26],
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

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function Map({ lat, lon, mairies = [] }: Props) {
  return (
    <div className="h-[22rem] w-full md:h-96">
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={[lat, lon]} />

        <Marker position={[lat, lon]}>
          <Popup>Position sélectionnée</Popup>
        </Marker>

        {mairies.map((mairie, index) => (
          <Marker
            key={`${mairie.nom}-${index}`}
            position={[mairie.latitude, mairie.longitude]}
          >
            <Popup>
              <div className="min-w-48">
                <p className="font-bold text-blue-700">{mairie.nom}</p>
                <p className="text-sm text-slate-600">{mairie.adresse}</p>
                {mairie.city && (
                  <p className="mt-2 text-xs text-slate-500">
                    {mairie.city}
                    {mairie.postcode ? ` - ${mairie.postcode}` : ""}
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
