"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BuildingIcon, LocateIcon, MapPinIcon } from "./Icons";

const Map = dynamic(() => import("./Map"), { ssr: false });

type Mairie = {
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  postcode?: string;
  city?: string;
};

type Location = {
  lat: number;
  lon: number;
};

export default function LocateMe() {
  const [position, setPosition] = useState<Location | null>(null);
  const [mairies, setMairies] = useState<Mairie[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  const fetchMairies = async (location: Location) => {
    const res = await fetch(`/api/mairies?lat=${location.lat}&lon=${location.lon}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Impossible de récupérer les mairies proches.");
    }

    setMairies(Array.isArray(data) ? data : []);
  };

  const handleLocate = () => {
    setError("");
    setLoading(true);

    if (!navigator.geolocation) {
      void fetchLocationByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };

        try {
          setPosition(location);
          setShowManualInput(false);
          await fetchMairies(location);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Impossible de récupérer les mairies proches.",
          );
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "La localisation est refusée. Vous pouvez entrer vos coordonnées manuellement.",
          );
          setShowManualInput(true);
          setLoading(false);
          return;
        }

        void fetchLocationByIP();
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  };

  const fetchLocationByIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      if (!data.latitude || !data.longitude) {
        setShowManualInput(true);
        return;
      }

      const location = {
        lat: Number(data.latitude),
        lon: Number(data.longitude),
      };

      setPosition(location);
      setShowManualInput(false);
      await fetchMairies(location);
    } catch {
      setShowManualInput(true);
      setError("Entrez vos coordonnées pour afficher les mairies proches.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    const lat = Number.parseFloat(manualLat);
    const lon = Number.parseFloat(manualLon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setError("Veuillez entrer des coordonnées valides.");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Coordonnées invalides : latitude -90 à 90, longitude -180 à 180.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const location = { lat, lon };
      setPosition(location);
      await fetchMairies(location);
      setShowManualInput(false);
      setManualLat("");
      setManualLon("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les mairies proches.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleLocate}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? (
          <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <LocateIcon className="size-4" />
        )}
        Utiliser ma position
      </button>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {showManualInput && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="font-bold text-slate-950">Entrer vos coordonnées GPS</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Latitude
              </span>
              <input
                type="number"
                value={manualLat}
                onChange={(event) => setManualLat(event.target.value)}
                placeholder="48.8566"
                step="0.0001"
                className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Longitude
              </span>
              <input
                type="number"
                value={manualLon}
                onChange={(event) => setManualLon(event.target.value)}
                placeholder="2.3522"
                step="0.0001"
                className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={loading}
              className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-slate-300"
            >
              Valider
            </button>
          </div>
        </div>
      )}

      {position && (
        <div className="mt-5">
          <div className="mb-4 flex flex-col gap-2 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-slate-950">
                {mairies.length} mairie(s) trouvée(s)
              </p>
              <p className="text-sm text-slate-600">
                Carte centrée sur votre position estimée.
              </p>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {position.lat.toFixed(4)}, {position.lon.toFixed(4)}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <Map lat={position.lat} lon={position.lon} mairies={mairies} />
          </div>

          {mairies.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-950">
                <BuildingIcon className="size-5 text-blue-700" />
                Mairies proches
              </h3>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {mairies.map((mairie, index) => (
                  <div key={`${mairie.nom}-${index}`} className="flex gap-3 p-4">
                    <MapPinIcon className="mt-1 size-4 shrink-0 text-amber-700" />
                    <div>
                      <p className="font-semibold text-slate-950">{mairie.nom}</p>
                      <p className="text-sm leading-6 text-slate-600">
                        {mairie.adresse}
                      </p>
                      {mairie.city && (
                        <p className="text-xs font-semibold text-slate-500">
                          {mairie.city}
                          {mairie.postcode ? ` - ${mairie.postcode}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
