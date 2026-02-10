async function getDemarches() {
  const res = await fetch("http://localhost:3000/api/demarches", {
    cache: "no-store",
  });
  return res.json();
}

export default async function DemarchesPage() {
  const demarches = await getDemarches();
  console.log(demarches)

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">📋 Toutes les démarches</h1>
          <p className="text-blue-100 text-lg">Trouvez les informations nécessaires pour vos démarches administratives</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demarches.map((d: any) => (
            <a
              key={d.slug}
              href={`/demarches/${d.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100"
            >
              <div className="h-2 bg-linear-to-r from-blue-600 to-blue-800 group-hover:from-blue-700 group-hover:to-blue-900"></div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{d.titre}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-semibold">⏳</span>
                    <span className="text-sm text-gray-600">{d.delai}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">💰</span>
                    <span className="text-sm text-gray-600">{d.prix}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600 font-semibold">📍</span>
                    <span className="text-sm text-gray-600">{d.lieu}</span>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Voir détails →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
