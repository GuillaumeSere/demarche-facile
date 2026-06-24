import { NextResponse } from "next/server";

type GeoFeature = {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: Record<string, unknown>;
};

function firstText(value: unknown) {
  if (Array.isArray(value)) return String(value[0] ?? "");
  return String(value ?? "");
}

function asTextArray(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item));
  return value ? [String(value)] : [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude et longitude requises" }, { status: 400 });
  }

  try {
    const reverseUrl = `https://data.geopf.fr/geocodage/reverse?lon=${lon}&lat=${lat}&index=address`;
    const reverseRes = await fetch(reverseUrl);

    if (!reverseRes.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération de la commune" },
        { status: reverseRes.status },
      );
    }

    const reverseData = await reverseRes.json();
    const reverseFeatures = Array.isArray(reverseData.features)
      ? reverseData.features
      : [];

    if (reverseFeatures.length === 0) {
      return NextResponse.json({ error: "Commune non trouvée" }, { status: 404 });
    }

    const communeInfo = reverseFeatures[0].properties || {};
    const cityName =
      firstText(communeInfo.city) || firstText(communeInfo.commune) || "Commune inconnue";
    const cityCode = firstText(communeInfo.citycode) || firstText(communeInfo.code);

    const searchUrl = `https://data.geopf.fr/geocodage/search?q=mairie&citycode=${cityCode}&index=poi&limit=10`;
    const res = await fetch(searchUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des mairies" },
        { status: res.status },
      );
    }

    const data = await res.json();
    const features = Array.isArray(data.features) ? data.features : [];

    const mairies = features
      .filter((feature: GeoFeature) => {
        const props = feature.properties || {};
        const toponym = firstText(props.toponym).toLowerCase();
        const name = firstText(props.name).toLowerCase();
        const featureCityCode = firstText(props.citycode);
        const categories = asTextArray(props.category).map((item) => item.toLowerCase());
        const label = `${toponym} ${name}`;

        const mentionsMairie = label.includes("mairie");
        const isNotParking = !label.includes("parking");
        const isMairieCategory =
          categories.length === 0 || categories.some((category) => category.includes("mairie"));
        const isSameCity = !cityCode || featureCityCode === cityCode;

        return mentionsMairie && isNotParking && isMairieCategory && isSameCity;
      })
      .map((feature: GeoFeature) => {
        const props = feature.properties || {};
        const name = firstText(props.name);
        const toponym = firstText(props.toponym) || name || "Mairie";
        const city = firstText(props.city) || cityName;
        const postcode = firstText(props.postcode);
        const coordinates = feature.geometry?.coordinates || [0, 0];

        return {
          nom: toponym,
          adresse: toponym || "Adresse non disponible",
          postcode,
          city,
          latitude: coordinates[1] || 0,
          longitude: coordinates[0] || 0,
          category: "mairie",
          score: Number(props.score) || 0,
        };
      });

    return NextResponse.json(mairies);
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur: " + String(err) },
      { status: 500 },
    );
  }
}
