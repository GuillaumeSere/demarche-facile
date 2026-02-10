"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

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
};

type MapLocation = {
  lat: number;
  lon: number;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [currentUserLocation, setCurrentUserLocation] = useState<MapLocation | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Autocomplete lors de la saisie
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      await performSearch(query);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Ajouter les coordonnées de l'utilisateur si disponibles
      let searchUrl = `/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`;
      
      if (currentUserLocation) {
        searchUrl += `&lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`;
      }

      const res = await fetch(searchUrl);
      if (!res.ok) throw new Error("Erreur de recherche");

      const data = await res.json();
      console.log("Résultats de recherche:", data);
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setSelectedLocation({
      lat: result.latitude,
      lon: result.longitude,
    });
    setQuery(result.label);
    setShowResults(false);
    setResults([]);
  };

  const handleInputFocus = () => {
    // Réaffiche les résultats quand on reclique sur l'input (s'ils existent)
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleLocateUser = () => {
    console.log("🔍 Tentative de géolocalisation (rapide)...");
    setLoading(true);
    
    if (!navigator.geolocation) {
      console.warn("⚠️ Géolocalisation native non disponible, utilisation de la géolocalisation par IP...");
      fetchLocationByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log("✓ Position utilisateur récupérée :", pos);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const userLoc = { lat, lon };
        setCurrentUserLocation(userLoc);
        setShowManualInput(false);
        
        // Récupérer les mairies pour cette position
        try {
          console.log(`📍 Appel API mairies pour lat=${lat}, lon=${lon}`);
          const res = await fetch(`/api/mairies?lat=${lat}&lon=${lon}`);
          const mairies = await res.json();
          console.log("✓ Mairies récupérées :", mairies);
        } catch (err) {
          console.error("❌ Erreur lors de la récupération des mairies:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("❌ Erreur de géolocalisation - Code:", err.code, "Message:", err.message);
        
        let errorMsg = "";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = "❌ Permission refusée. Activez la géolocalisation dans les paramètres du navigateur.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = "❌ Position non disponible. Utilisation de la géolocalisation par IP...";
            fetchLocationByIP();
            return;
          case err.TIMEOUT:
            errorMsg = "⏱️ Géolocalisation trop lente. Utilisation de la géolocalisation par IP...";
            fetchLocationByIP();
            return;
          default:
            errorMsg = `❌ Erreur: ${err.message}`;
        }
        console.error(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,  // 15 secondes
        maximumAge: 0
      }
    );
  };

  const fetchLocationByIP = async () => {
    try {
      console.log("📡 Tentative de géolocalisation par IP...");
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      
      if (data.latitude && data.longitude) {
        console.log("✓ Position par IP récupérée:", data);
        const lat = data.latitude;
        const lon = data.longitude;
        const userLoc = { lat, lon };
        setCurrentUserLocation(userLoc);
        setShowManualInput(false);
        
        // Récupérer les mairies
        try {
          const mairiesRes = await fetch(`/api/mairies?lat=${lat}&lon=${lon}`);
          const mairies = await mairiesRes.json();
          console.log("✓ Mairies récupérées :", mairies);
        } catch (err) {
          console.error("❌ Erreur lors de la récupération des mairies:", err);
        }
      } else {
        console.warn("⚠️ Position par IP indisponible, formulaire manuel requis");
        setShowManualInput(true);
      }
    } catch (err) {
      console.error("❌ Erreur géolocalisation IP:", err);
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || isNaN(lon)) {
      console.error("Coordonnées invalides");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      console.error("Coordonnées hors limites");
      return;
    }

    console.log(`✓ Coordonnées manuelles acceptées: lat=${lat}, lon=${lon}`);
    setLoading(true);

    try {
      const userLoc = { lat, lon };
      setCurrentUserLocation(userLoc);
      setShowManualInput(false);
      setManualLat("");
      setManualLon("");

      // Récupérer les mairies
      console.log(`📍 Appel API mairies pour lat=${lat}, lon=${lon}`);
      const res = await fetch(`/api/mairies?lat=${lat}&lon=${lon}`);
      const mairies = await res.json();
      console.log("✓ Mairies récupérées :", mairies);
    } catch (err) {
      console.error("❌ Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Barre de recherche */}
      <div className="relative mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher une adresse, service, mairie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            {loading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <button
            onClick={handleLocateUser}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Localisation...
              </>
            ) : (
              "📍 Ma position"
            )}
          </button>
        </div>

        {/* Formulaire d'entrée manuelle */}
        {showManualInput && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3">Entrer vos coordonnées GPS :</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="48.8566"
                  step="0.0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  value={manualLon}
                  onChange={(e) => setManualLon(e.target.value)}
                  placeholder="2.3522"
                  step="0.0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
            <button
              onClick={handleManualSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Valider
            </button>
          </div>
        )}

        {/* Résultats autocomplete */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 transition-colors"
              >
                <div className="font-semibold text-gray-900">{result.label}</div>
                {result.city && (
                  <div className="text-sm text-gray-600">
                    {result.city}
                    {result.postcode && ` - ${result.postcode}`}
                  </div>
                )}
                {result.score && (
                  <div className="text-xs text-gray-500">
                    Pertinence: {Math.round(result.score * 100)}%
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {showResults && query.trim() && results.length === 0 && !loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 text-center text-gray-500">
            Aucun résultat trouvé pour "{query}"
          </div>
        )}
      </div>

      {/* Affichage de la carte si une localisation est sélectionnée */}
      {selectedLocation && (
        <div className="rounded-lg overflow-hidden z-0 border border-gray-300">
          <Map lat={selectedLocation.lat} lon={selectedLocation.lon} mairies={[]} />
        </div>
      )}

      {/* Affichage de la carte avec la position de l'utilisateur */}
      {currentUserLocation && !selectedLocation && (
        <div className="rounded-lg overflow-hidden z-0 border border-gray-300">
          <Map lat={currentUserLocation.lat} lon={currentUserLocation.lon} mairies={[]} />
        </div>
      )}
    </div>
  );
}