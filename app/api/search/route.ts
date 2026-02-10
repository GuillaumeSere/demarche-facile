import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "address"; // address, poi
  const limit = searchParams.get("limit") || "10";
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: "Paramètre 'q' requis" }, { status: 400 });
  }

  try {
    // Construire l'URL de l'API Géoplaterforme
    let url = `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(q)}&limit=${limit}&autocomplete=true`;

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
    if (!res.ok) {
      console.error("Erreur API Géoplaterforme:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Erreur lors de la recherche" },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Résultats recherche:", data);

    // Transformer les résultats au format attendu
    const results = (data.features || []).map((feature: any) => {
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
      };
    });

    return NextResponse.json(results);
  } catch (err) {
    console.error("Erreur lors de la recherche:", err);
    return NextResponse.json(
      { error: "Erreur serveur: " + String(err) },
      { status: 500 }
    );
  }
}
