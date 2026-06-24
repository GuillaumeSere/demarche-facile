import { NextResponse } from "next/server";
import demarches from "../../data/demarches.json";
import type { Demarche } from "../../types/demarche";

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
  lieu?: Demarche["lieu"];
  name?: string;
  citycode?: string;
  category?: string;
  housenumber?: string;
  street?: string;
};

type GeoFeature = {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: Record<string, unknown>;
};

const allDemarches = demarches as Demarche[];

function text(value: unknown) {
  if (Array.isArray(value)) return String(value[0] ?? "");
  return String(value ?? "");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "address";
  const limitParam = searchParams.get("limit");
  const parsedLimit = Number.parseInt(limitParam ?? "10", 10);
  const safeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: "Paramètre 'q' requis" }, { status: 400 });
  }

  try {
    let addressResults: SearchResult[] = [];
    let url = `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(
      q,
    )}&limit=${safeLimit}&autocomplete=true`;

    url += type === "poi" ? "&index=poi" : "&index=address";

    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    }

    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      const features = Array.isArray(data.features) ? data.features : [];

      addressResults = features.map((feature: GeoFeature) => {
        const props = feature.properties || {};
        const coordinates = feature.geometry?.coordinates || [0, 0];
        const label = text(props.label || props.name || props.toponyme);

        return {
          id: text(props.id) || crypto.randomUUID(),
          type: text(props.type) || type,
          label: label || "Résultat",
          name: text(props.name || props.toponyme),
          city: text(props.city),
          postcode: text(props.postcode),
          citycode: text(props.citycode),
          address: label,
          score: Number(props.score) || 0,
          latitude: coordinates[1] || 0,
          longitude: coordinates[0] || 0,
          category: text(props.category),
          housenumber: text(props.housenumber),
          street: text(props.street),
          resultType: "address",
        };
      });
    }

    const searchValue = normalize(q);
    const serviceResults = allDemarches
      .filter((demarche) => {
        const titleMatch = normalize(demarche.titre).includes(searchValue);
        const documentMatch = demarche.documents.some((doc) =>
          normalize(doc).includes(searchValue),
        );
        const placeMatch = normalize(demarche.lieu.nom).includes(searchValue);

        return titleMatch || documentMatch || placeMatch;
      })
      .slice(0, Math.max(1, Math.floor(safeLimit / 2)))
      .map<SearchResult>((demarche) => ({
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
        score: 1,
        latitude: 0,
        longitude: 0,
        resultType: "service",
      }));

    return NextResponse.json([...serviceResults, ...addressResults]);
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur: " + String(err) },
      { status: 500 },
    );
  }
}
