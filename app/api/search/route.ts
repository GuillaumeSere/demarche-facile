import { NextResponse } from "next/server";

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
    resultType: "address" | "service";
    slug?: string;
    prix?: string;
    delai?: string;
    lieu?: any;
    name?: string;
    citycode?: string;
    category?: string;
    housenumber?: string;
    street?: string;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const type = searchParams.get("type") || "address"; // address, poi
    const limitParam = searchParams.get("limit");
    const parsedLimit = Number.parseInt(limitParam ?? "10", 10);
    const safeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!q || q.trim().length === 0) {
        return NextResponse.json({ error: "Paramètre 'q' requis" }, { status: 400 });
    }

    try {
        // 1. Rechercher les adresses via Géoplaterforme
        let addressResults: SearchResult[] = [];
        let url = `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(q)}&limit=${safeLimit}&autocomplete=true`;

        // Ajouter l'index
        if (type === "poi") {
            url += "&index=poi";
        } else {
            url += "&index=address";
        }

        // Ajouter lat/lon si disponibles pour favoriser les résultats proches
        if (lat && lon) {
            url += `&lat=${lat}&lon=${lon}`;
        }

        console.log("Appel API Géoplaterforme:", url);

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            console.log("Résultats recherche adresses:", data);

            // Transformer les résultats au format attendu
            addressResults = (data.features || []).map((feature: any) => {
                const props = feature.properties || {};
                return {
                    id: props.id || Math.random().toString(),
                    type: props.type || type,
                    label: props.label || props.name || props.toponyme || "Résultat",
                    name: props.name || props.toponyme || "",
                    city: props.city || "",
                    postcode: props.postcode || "",
                    citycode: props.citycode || "",
                    address: props.label || "",
                    score: props.score || 0,
                    latitude: feature.geometry?.coordinates?.[1] || 0,
                    longitude: feature.geometry?.coordinates?.[0] || 0,
                    // Pour les POI
                    category: props.category || "",
                    // Pour les adresses
                    housenumber: props.housenumber || "",
                    street: props.street || "",
                    resultType: "address", // Marquer comme résultat d'adresse
                };
            });
        } else {
            console.error("Erreur API Géoplaterforme:", res.status, res.statusText);
        }

        // 2. Rechercher dans les démarches/services
        let serviceResults: SearchResult[] = [];
        try {
            const demarches = await import("../../data/demarches.json").then(m => m.default);
            const searchLower = q.toLowerCase();

            serviceResults = demarches
                .filter((demarche: any) =>
                    demarche.titre.toLowerCase().includes(searchLower) ||
                    demarche.documents.some((doc: string) => doc.toLowerCase().includes(searchLower))
                )
                .slice(0, Math.max(1, Math.floor(safeLimit / 2))) // Limiter les services à la moitié de la limite
                .map((demarche: any) => ({
                    id: `service-${demarche.slug}`,
                    type: "service",
                    label: demarche.titre,
                    slug: demarche.slug,
                    prix: demarche.prix,
                    delai: demarche.delai,
                    lieu: demarche.lieu,
                    address: "",
                    city: "",
                    postcode: "",
                    score: 0,
                    latitude: 0,
                    longitude: 0,
                    resultType: "service", // Marquer comme résultat de service
                }));
        } catch (err) {
            console.error("Erreur recherche services:", err);
        }

        // 3. Combiner et retourner les résultats
        const combinedResults = [...addressResults, ...serviceResults];

        return NextResponse.json(combinedResults);
    } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        return NextResponse.json(
            { error: "Erreur serveur: " + String(err) },
            { status: 500 }
        );
    }
}

