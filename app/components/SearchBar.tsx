"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  BuildingIcon,
  ClockIcon,
  LocateIcon,
  MapPinIcon,
  SearchIcon,
  WalletIcon,
} from "./Icons";

const Map = dynamic(() => import("./Map"), { ssr: false });

type SearchResult = {
  id: string;
  label: string;
  address: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  type: string;
  score: number;
  resultType?: "address" | "service";
  slug?: string;
  prix?: string;
  delai?: string;
};

type MapLocation = {
  lat: number;
  lon: number;
};

type Mairie = {
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  city?: string;
  postcode?: string;
};

const quickSearches = [
  "Carte d'identité",
  "Passeport",
  "Changement d'adresse",
  "Allocation logement",
];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [currentUserLocation, setCurrentUserLocation] =
    useState<MapLocation | null>(null);
  const [nearbyMairies, setNearbyMairies] = useState<Mairie[]>([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [error, setError] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(
    async (searchQuery: string, revealResults = true) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setSearching(true);
      setError("");

      try {
        let searchUrl = `/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`;

        if (currentUserLocation) {
          searchUrl += `&lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`;
        }

        const res = await fetch(searchUrl);
        if (!res.ok) throw new Error("La recherche n'a pas abouti.");

        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setShowResults(revealResults);
      } catch (err) {
        setResults([]);
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de lancer la recherche pour le moment.",
        );
      } finally {
        setSearching(false);
      }
    },
    [currentUserLocation],
  );

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      void performSearch(query);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [performSearch, query]);

  const fetchMairies = async (location: MapLocation) => {
    const res = await fetch(`/api/mairies?lat=${location.lat}&lon=${location.lon}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Impossible de récupérer les mairies proches.");
    }

    setNearbyMairies(Array.isArray(data) ? data : []);
  };

  const handleSelectResult = (result: SearchResult) => {
    if (result.resultType === "service" && result.slug) {
      router.push(`/demarches/${result.slug}`);
      return;
    }

    setSelectedLocation({
      lat: result.latitude,
      lon: result.longitude,
    });
    setQuery(result.label);
    setShowResults(false);
    setResults([]);
  };

  const handleQuickSearch = (value: string) => {
    setQuery(value);
    void performSearch(value);
  };

  const handleLocateUser = () => {
    setError("");
    setLocating(true);
    setSelectedLocation(null);

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
          setCurrentUserLocation(location);
          setShowManualInput(false);
          await fetchMairies(location);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Impossible de récupérer les services proches.",
          );
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "La localisation est refusée. Vous pouvez entrer vos coordonnées manuellement.",
          );
          setShowManualInput(true);
          setLocating(false);
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

      setCurrentUserLocation(location);
      setShowManualInput(false);
      await fetchMairies(location);
    } catch {
      setShowManualInput(true);
      setError("Entrez vos coordonnées pour afficher les services proches.");
    } finally {
      setLocating(false);
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
    setLocating(true);

    try {
      const location = { lat, lon };
      setCurrentUserLocation(location);
      setSelectedLocation(null);
      await fetchMairies(location);
      setShowManualInput(false);
      setManualLat("");
      setManualLon("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les services proches.",
      );
    } finally {
      setLocating(false);
    }
  };

  const mapLocation = selectedLocation ?? currentUserLocation;
  const mapTitle = selectedLocation
    ? "Adresse sélectionnée"
    : "Services proches de votre position";

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        {quickSearches.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleQuickSearch(item)}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {item}
          </button>
        ))}
      </div>

      <form
        className="relative"
        onSubmit={(event) => {
          event.preventDefault();
          void performSearch(query);
        }}
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Rechercher une démarche ou une adresse</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Rechercher une démarche, une adresse, une mairie..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-12 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {searching && (
              <span className="absolute right-4 top-1/2 size-5 -translate-y-1/2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            )}
          </label>

          <button
            type="submit"
            disabled={searching || query.trim().length < 2}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Rechercher
            <ArrowRightIcon className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleLocateUser}
            disabled={locating}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            {locating ? (
              <span className="size-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            ) : (
              <LocateIcon className="size-4" />
            )}
            Ma position
          </button>
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
            {results.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
              >
                <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                  {result.resultType === "service" ? (
                    <BuildingIcon className="size-4" />
                  ) : (
                    <MapPinIcon className="size-4" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-950">
                    {result.label}
                  </span>
                  {result.resultType === "service" ? (
                    <span className="mt-1 flex flex-wrap gap-3 text-sm text-slate-600">
                      {result.prix && (
                        <span className="inline-flex items-center gap-1">
                          <WalletIcon className="size-3.5" />
                          {result.prix}
                        </span>
                      )}
                      {result.delai && (
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="size-3.5" />
                          {result.delai}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="mt-1 block text-sm text-slate-600">
                      {[result.city, result.postcode].filter(Boolean).join(" - ")}
                    </span>
                  )}
                </span>
                <ArrowRightIcon className="mt-2 size-4 shrink-0 text-blue-700" />
              </button>
            ))}
          </div>
        )}

        {showResults && query.trim() && results.length === 0 && !searching && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-lg border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-xl">
            Aucun résultat trouvé pour “{query}”.
          </div>
        )}
      </form>

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
              disabled={locating}
              className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-slate-300"
            >
              Valider
            </button>
          </div>
        </div>
      )}

      {mapLocation && (
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-col gap-1 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-950">{mapTitle}</h3>
              <p className="text-sm text-slate-600">
                {nearbyMairies.length > 0
                  ? `${nearbyMairies.length} mairie(s) trouvée(s)`
                  : "Carte centrée sur le point choisi"}
              </p>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {mapLocation.lat.toFixed(4)}, {mapLocation.lon.toFixed(4)}
            </p>
          </div>
          <Map
            lat={mapLocation.lat}
            lon={mapLocation.lon}
            mairies={selectedLocation ? [] : nearbyMairies}
          />
        </div>
      )}
    </div>
  );
}
