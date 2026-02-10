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
        <main className="min-h-screen bg-linear-to-b from-blue-50 to-white">
            <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-12">
                <div className="max-w-4xl mx-auto px-6">
                    <a href="/demarches" className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors">
                        ← Retour aux démarches
                    </a>
                    <h1 className="text-4xl font-bold mb-2">{demarche.titre}</h1>
                    <p className="text-blue-100">Toutes les informations pour cette démarche administrative</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                        <p className="text-sm text-gray-600 mb-1">💰 Tarif</p>
                        <p className="text-2xl font-bold text-green-600">{demarche.prix}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                        <p className="text-sm text-gray-600 mb-1">⏳ Délai moyen</p>
                        <p className="text-2xl font-bold text-blue-600">{demarche.delai}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                        <p className="text-sm text-gray-600 mb-1">📍 Lieu</p>
                        <p className="text-lg font-bold text-orange-600">{demarche.lieu}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        Documents nécessaires
                    </h2>
                    <ul className="space-y-3">
                        {demarche.documents.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">✓</span>
                                <span className="text-gray-700">{doc}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-2xl">🏛️</span>
                        Trouver une mairie
                    </h2>
                    <LocateMe />
                </div>
            </div>
        </main>
    );
}
