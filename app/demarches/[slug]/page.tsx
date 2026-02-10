import { notFound } from "next/navigation";
import { Demarche } from "../../types/demarche";
import LocateMe from "../../components/LocateMe";

async function getDemarche(slug: string) {
    try {
        const res = await fetch("http://localhost:3000/api/demarches", { cache: "no-store" });
        if (!res.ok) {
            console.log("API /api/demarches returned", res.status);
            // fallback to local JSON
            const demarches = (await import("../../data/demarches.json")).default as Demarche[];
            return demarches.find((d) => d.slug === slug) || null;
        }

        const demarches: Demarche[] = await res.json();
        return demarches.find((d) => d.slug === slug) || null;
    } catch (err) {
        console.log("fetch error:", err);
        const demarches = (await import("../../data/demarches.json")).default as Demarche[];
        return demarches.find((d) => d.slug === slug) || null;
    }
}

type Props = {
    params: {
        slug: string;
    };
};

export default async function DemarcheDetail({ params }: Props) {
    const resolvedParams: any = await (params as any);
    const slug = resolvedParams?.slug;

    if (!slug) return notFound();

    const demarche = await getDemarche(slug);

    if (!demarche) return notFound();

    return (
        <main className="p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{demarche.titre}</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">📄 Documents nécessaires</h2>
                <ul className="list-disc pl-6 space-y-1">
                    {demarche.documents.map((doc, i) => (
                        <li key={i}>{doc}</li>
                    ))}
                </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="border p-4 rounded">
                    <p className="font-semibold">💰 Prix</p>
                    <p>{demarche.prix}</p>
                </div>

                <div className="border p-4 rounded">
                    <p className="font-semibold">⏳ Délai moyen</p>
                    <p>{demarche.delai}</p>
                </div>

                <div className="border p-4 rounded sm:col-span-2">
                    <p className="font-semibold">📍 Où faire la demande</p>
                    <p>{demarche.lieu}</p>
                </div>
            </div>

            <LocateMe />
        </main>
    );
}
