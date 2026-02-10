"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

type Mairie = {
    nom: string;
    adresse: string;
    latitude: number;
    longitude: number;
    postcode?: string;
    city?: string;
};

export default function LocateMe() {
    const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null);
    const [mairies, setMairies] = useState<Mairie[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [manualLat, setManualLat] = useState("");
    const [manualLon, setManualLon] = useState("");
    const [showManualInput, setShowManualInput] = useState(false);

    const handleLocate = () => {
        console.log("🔍 Tentative de géolocalisation (rapide)...");
        setError("");
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
                
                try {
                    setPosition({ lat, lon });
                    setShowManualInput(false);
                    
                    // Récupérer les mairies
                    console.log(`📍 Appel API mairies pour lat=${lat}, lon=${lon}`);
                    const res = await fetch(`/api/mairies?lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    
                    if (!res.ok) {
                        throw new Error(data.error || "Erreur lors de la récupération des mairies");
                    }
                    
                    console.log("✓ Mairies récupérées :", data);
                    setMairies(data);
                } catch (err) {
                    console.error("❌ Erreur :", err);
                    setError(err instanceof Error ? err.message : "Impossible de récupérer les mairies proches de vous.");
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
                setError(errorMsg);
                setLoading(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
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
                
                setPosition({ lat, lon });
                setShowManualInput(false);
                
                // Récupérer les mairies
                try {
                    console.log(`📍 Appel API mairies pour lat=${lat}, lon=${lon}`);
                    const mairiesRes = await fetch(`/api/mairies?lat=${lat}&lon=${lon}`);
                    const mairies = await mairiesRes.json();
                    console.log("✓ Mairies récupérées :", mairies);
                    setMairies(mairies);
                } catch (err) {
                    console.error("❌ Erreur lors de la récupération des mairies:", err);
                    setError("Erreur lors de la récupération des mairies.");
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
            setError("❌ Veuillez entrer des coordonnées valides (nombres)");
            return;
        }

        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            setError("❌ Coordonnées invalides (lat: -90 à 90, lon: -180 à 180)");
            return;
        }

        setError("");
        setLoading(true);

        try {
            setPosition({ lat, lon });
            
            // Récupérer les mairies
            const res = await fetch(`/api/mairies?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Erreur lors de la récupération des mairies");
            }
            
            console.log("Mairies récupérées :", data);
            setMairies(data);
            setShowManualInput(false);
        } catch (err) {
            console.error("Erreur :", err);
            setError(err instanceof Error ? err.message : "Impossible de récupérer les mairies.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={handleLocate}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Localisation...
                    </>
                ) : (
                    <>
                        📍 Utiliser ma position
                    </>
                )}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Formulaire d'entrée manuelle */}
            {showManualInput && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-3">Entrer vos coordonnées GPS :</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Latitude (ex: 48.8566)
                            </label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Longitude (ex: 2.3522)
                            </label>
                            <input
                                type="number"
                                value={manualLon}
                                onChange={(e) => setManualLon(e.target.value)}
                                placeholder="2.3522"
                                step="0.0001"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                            />
                        </div>
                        <button
                            onClick={handleManualSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Valider les coordonnées
                        </button>
                    </div>
                </div>
            )}

            {position && (
                <div className="mt-4">
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Position:</strong> {position.lat.toFixed(4)}, {position.lon.toFixed(4)}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                            <strong>Mairies trouvées:</strong> {mairies.length}
                        </p>
                    </div>
                    
                    <Map lat={position.lat} lon={position.lon} mairies={mairies} />

                    {/* Liste des mairies */}
                    {mairies.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h3 className="font-bold text-gray-900 mb-3">Mairies proches:</h3>
                            {mairies.map((mairie, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                                    <p className="font-semibold text-gray-900">{mairie.nom}</p>
                                    <p className="text-sm text-gray-600">{mairie.adresse}</p>
                                    {mairie.city && (
                                        <p className="text-xs text-gray-500">
                                            {mairie.city} {mairie.postcode && `- ${mairie.postcode}`}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

