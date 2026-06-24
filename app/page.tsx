"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BuildingIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClockIcon,
  FileTextIcon,
  MapPinIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "./components/Icons";

const SearchBar = dynamic(() => import("./components/SearchBar"), { ssr: false });

const popularDemarches = [
  {
    title: "Carte d'identité",
    href: "/demarches/carte-identite",
    detail: "Documents, mairie, délai",
    meta: "2 à 4 semaines",
    icon: <FileTextIcon className="size-5" />,
    accent: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  {
    title: "Passeport",
    href: "/demarches/passeport",
    detail: "Timbre fiscal et pièces utiles",
    meta: "3 à 6 semaines",
    icon: <ClipboardCheckIcon className="size-5" />,
    accent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    title: "Changement d'adresse",
    href: "/demarches/changement-adresse",
    detail: "Organismes à prévenir",
    meta: "Immédiat",
    icon: <MapPinIcon className="size-5" />,
    accent: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    title: "Allocation logement",
    href: "/demarches/allocation-logement",
    detail: "Justificatifs et dépôt CAF",
    meta: "4 à 6 semaines",
    icon: <WalletIcon className="size-5" />,
    accent: "bg-sky-50 text-sky-700 ring-sky-100",
  },
];

const journeyCards = [
  {
    title: "Préparer le dossier",
    description:
      "Repérez les justificatifs indispensables avant de vous déplacer ou de remplir un formulaire.",
    image: "/images/documents-preparation.png",
    alt: "Documents administratifs organisés avec une checklist",
  },
  {
    title: "Choisir le bon parcours",
    description:
      "Comparez les démarches proches et évitez les allers-retours liés à une mauvaise orientation.",
    image: "/images/parcours-guide.png",
    alt: "Interface de parcours administratif sur tablette",
  },
  {
    title: "Trouver le bon lieu",
    description:
      "Localisez rapidement le service compétent : mairie, CAF, ANTS ou autre organisme utile.",
    image: "/images/services-proches.png",
    alt: "Téléphone affichant une carte près d'un service public",
  },
];

const trustItems = [
  {
    icon: <CheckCircleIcon className="size-5" />,
    title: "Étapes claires",
    description: "Chaque fiche distingue les documents, le délai, le coût et le lieu.",
  },
  {
    icon: <BuildingIcon className="size-5" />,
    title: "Services proches",
    description: "La carte vous aide à situer les administrations autour de vous.",
  },
  {
    icon: <ShieldCheckIcon className="size-5" />,
    title: "Moins d'incertitude",
    description: "Vous arrivez avec une liste concrète au lieu d'informations dispersées.",
  },
];

export default function Home() {
  return (
    <main className="bg-slate-50">
      <section className="relative min-h-[560px] overflow-hidden bg-slate-950 md:min-h-[620px]">
        <Image
          src="/images/demarche-hero.png"
          alt="Accompagnement dans une démarche administrative"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/60 to-slate-900/10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-slate-50 to-transparent" />

        <div className="relative mx-auto flex max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="max-w-2xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
              <ClockIcon className="size-4" />
              Documents, délais et lieux au même endroit
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Démarche Facile
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-100 md:text-xl">
              Trouvez la bonne démarche, préparez les bons documents et
              identifiez le service compétent avant de vous déplacer.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demarches"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
              >
                Voir les démarches
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="#recherche"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Chercher un service
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
                <p className="text-2xl font-bold">12</p>
                <p className="text-slate-200">démarches</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
                <p className="text-2xl font-bold">3</p>
                <p className="text-slate-200">repères clés</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
                <p className="text-2xl font-bold">1</p>
                <p className="text-slate-200">carte locale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recherche" className="relative z-10 -mt-10 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/80 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-blue-700">
                Orientation rapide
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Que voulez-vous faire aujourd&apos;hui ?
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Recherchez une démarche, une adresse ou utilisez votre position
              pour afficher les services proches.
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-emerald-700">
                Accès direct
              </p>
              <h2 className="mt-1 text-3xl font-bold text-slate-950">
                Démarches les plus demandées
              </h2>
            </div>
            <Link
              href="/demarches"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900"
            >
              Toutes les fiches
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {popularDemarches.map((demarche) => (
              <Link
                key={demarche.href}
                href={demarche.href}
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <span
                  className={`mb-5 grid size-11 place-items-center rounded-lg ring-1 ${demarche.accent}`}
                >
                  {demarche.icon}
                </span>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-700">
                  {demarche.title}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                  {demarche.detail}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="font-semibold text-slate-500">{demarche.meta}</span>
                  <ArrowRightIcon className="size-4 text-blue-700 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase text-blue-700">
              Parcours accompagné
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-950">
              Un site pensé pour les personnes mal orientées
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              L&apos;objectif est de réduire les hésitations : savoir quoi préparer,
              où aller et quelle fiche consulter.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {journeyCards.map((card, index) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="mb-4 inline-grid size-9 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {trustItems.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-14 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-sky-300">
              Prêt à préparer votre dossier ?
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold">
              Consultez la fiche adaptée avant de vous rendre auprès d&apos;un service.
            </h2>
          </div>
          <Link
            href="/demarches"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
          >
            Explorer les démarches
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
