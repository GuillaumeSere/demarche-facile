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
    <main className="p-10 max-w-4xl mx-auto ">
      <h1 className="text-2xl font-bold mb-6">Toutes les démarches</h1>

      <div className="grid gap-4">
        {demarches.map((d: any) => (
          <a
            key={d.slug}
            href={`/demarches/${d.slug}`}
            className="border p-4 rounded hover:bg-gray-50"
          >
            <h2 className="font-semibold">{d.titre}</h2>
            <p>Délai : {d.delai}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
