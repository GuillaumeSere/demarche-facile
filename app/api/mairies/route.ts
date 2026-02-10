import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat et lon requis" }, { status: 400 });
  }

  try {
    // ÉTAPE 1 : Récupérer le nom de la ville/commune
    console.log(`\n📍 ÉTAPE 1: Récupérer la commune pour lat=${lat}, lon=${lon}`);
    
    const reverseUrl = `https://data.geopf.fr/geocodage/reverse?lon=${lon}&lat=${lat}&index=address`;
    console.log("Appel API reverse:", reverseUrl);
    
    const reverseRes = await fetch(reverseUrl);
    if (!reverseRes.ok) {
      console.error("Erreur API reverse:", reverseRes.status, reverseRes.statusText);
      return NextResponse.json(
        { error: "Erreur lors de la récupération de la commune" },
        { status: reverseRes.status }
      );
    }

    const reverseData = await reverseRes.json();
    console.log("Données reverse brutes:", JSON.stringify(reverseData, null, 2));

    if (!reverseData.features || reverseData.features.length === 0) {
      console.warn("❌ Aucune commune trouvée à ces coordonnées");
      return NextResponse.json({ error: "Commune non trouvée" }, { status: 404 });
    }

    const communeInfo = reverseData.features[0].properties;
    const cityName = communeInfo.city || communeInfo.commune || "Commune inconnue";
    const cityCode = communeInfo.citycode || communeInfo.code;
    
    console.log(`✓ Commune trouvée: "${cityName}" (code INSEE: ${cityCode})`);

    // ÉTAPE 2 : Chercher les mairies dans cette commune
    console.log(`\n📍 ÉTAPE 2: Chercher les mairies pour la commune "${cityName}"`);
    
    const searchUrl = `https://data.geopf.fr/geocodage/search?q=mairie&citycode=${cityCode}&index=poi&limit=10`;
    console.log("Appel API mairie:", searchUrl);

    const res = await fetch(searchUrl);
    if (!res.ok) {
      console.error("Erreur API Géoplaterforme:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des mairies" },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Données POI brutes complètes:", JSON.stringify(data, null, 2));

    if (!data.features || !Array.isArray(data.features)) {
      console.warn("❌ Format inattendu - features non trouvé");
      return NextResponse.json([]);
    }

    console.log(`Total de résultats POI : ${data.features.length}`);

    // ÉTAPE 3 : Filtrer et transformer les données
    const mairies = data.features
      .filter((feature: any) => {
        const props = feature.properties || {};
        
        // Utiliser les bons noms de propriétés (API retourne 'toponym', pas 'label')
        const toponym = (props.toponym || "").toLowerCase();
        const name = Array.isArray(props.name) ? props.name[0].toLowerCase() : (props.name || "").toLowerCase();
        const featureCityCode = Array.isArray(props.citycode) ? props.citycode[0] : props.citycode;
        const featureCategory = Array.isArray(props.category) ? props.category : [props.category];
        
        // Critères de filtrage
        const isMairie = (toponym.includes("mairie") || name.includes("mairie")) && 
                         !toponym.includes("parking") && 
                         !name.includes("parking") &&
                         featureCategory.includes("mairie");
        const isSameCity = featureCityCode === cityCode;
        
        console.log(`  Feature: "${toponym || name}" (citycode: "${featureCityCode}") → ${isMairie ? "✓ Mairie" : "✗ Pas mairie"} ${isSameCity ? "✓ Code INSEE OK" : `✗ Code INSEE différent (attendu: ${cityCode})`}`);
        
        return isMairie && isSameCity;
      })
      .map((feature: any) => {
        const props = feature.properties || {};
        const name = Array.isArray(props.name) ? props.name[0] : props.name;
        const toponym = props.toponym || name || "Mairie";
        const city = Array.isArray(props.city) ? props.city[0] : props.city;
        const postcode = Array.isArray(props.postcode) ? props.postcode[0] : props.postcode;
        
        return {
          nom: toponym,
          adresse: toponym || "Adresse non disponible",
          postcode: postcode || "",
          city: city || cityName || "",
          latitude: feature.geometry?.coordinates?.[1] || 0,
          longitude: feature.geometry?.coordinates?.[0] || 0,
          category: "mairie",
          score: props.score || 0,
        };
      });

    console.log(`✓ Mairies filtrées: ${mairies.length} trouvées`);
    console.log("Mairies formatées:", JSON.stringify(mairies, null, 2));
    
    return NextResponse.json(mairies);
  } catch (err) {
    console.error("Erreur lors de la récupération:", err);
    return NextResponse.json(
      { error: "Erreur serveur: " + String(err) },
      { status: 500 }
    );
  }
}
