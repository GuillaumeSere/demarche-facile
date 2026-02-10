"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("./components/SearchBar"), { ssr: false });

export default function Home() {
  const features = [
    {
      icon: "📋",
      title: "Démarches Simplifiées",
      description: "Trouvez rapidement toutes les démarches administratives nécessaires pour simplifier votre vie.",
      href: "/demarches"
    },
    {
      icon: "🗺️",
      title: "Services Proches de Vous",
      description: "Localisez les mairies et services administratifs à proximité de votre domicile.",
      href: "/"
    },
    {
      icon: "📄",
      title: "Documents Requis",
      description: "Consultez la liste complète des documents nécessaires pour vos démarches.",
      href: "/demarches"
    },
    {
      icon: "⚡",
      title: "Gain de Temps",
      description: "Économisez du temps en accédant rapidement à toutes les informations administratives.",
      href: "/"
    }
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Assistant de Démarches Administratives
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Simplifiez vos démarches administratives. Trouvez rapidement les documents nécessaires et les services proches de chez vous.
          </p>
          <Link
            href="/demarches"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Commencer →
          </Link>
        </div>
      </section>

      {/* Barre de recherche */}
      <section className="px-4 py-12 bg-linear-to-r from-blue-50 to-blue-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Chercher une adresse ou un service
          </h2>
          <SearchBar />
        </div>
      </section>

      {/* Features Cards */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nos Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <div className="h-full bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-6 transition-all hover:shadow-lg cursor-pointer hover:scale-105">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Simplifier Vos Démarches?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Accédez maintenant à toutes les informations administratives dont vous avez besoin.
          </p>
          <Link
            href="/demarches"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explorez les démarches
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Comment Ça Marche?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Choisissez
              </h3>
              <p className="text-gray-600">
                Sélectionnez la démarche administrative dont vous avez besoin.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Consultez
              </h3>
              <p className="text-gray-600">
                Accédez à la liste complète des documents et services requis.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Agissez
              </h3>
              <p className="text-gray-600">
                Rendez-vous auprès des services compétents munis de tous les documents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

