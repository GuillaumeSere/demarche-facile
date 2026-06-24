import Link from "next/link";
import {
  ArrowRightIcon,
  BuildingIcon,
  ClockIcon,
  FileTextIcon,
  WalletIcon,
} from "../components/Icons";
import demarches from "../data/demarches.json";
import type { Demarche } from "../types/demarche";

const allDemarches = demarches as Demarche[];

export default async function DemarchesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase text-sky-300">
            Catalogue des démarches
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_18rem] md:items-end">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Toutes les démarches administratives
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Choisissez une fiche pour connaître les documents à préparer,
                le délai moyen, le prix et l&apos;organisme compétent.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-3xl font-bold">{allDemarches.length}</p>
              <p className="text-sm text-slate-300">fiches disponibles</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {allDemarches.map((demarche) => (
            <Link
              key={demarche.slug}
              href={`/demarches/${demarche.slug}`}
              className="group flex min-h-72 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <FileTextIcon className="size-5" />
                </span>
                <ArrowRightIcon className="mt-3 size-4 text-blue-700 transition group-hover:translate-x-1" />
              </div>

              <h2 className="text-xl font-bold text-slate-950 group-hover:text-blue-700">
                {demarche.titre}
              </h2>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p className="flex items-start gap-2">
                  <ClockIcon className="mt-0.5 size-4 shrink-0 text-blue-700" />
                  <span>{demarche.delai}</span>
                </p>
                <p className="flex items-start gap-2">
                  <WalletIcon className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                  <span>{demarche.prix}</span>
                </p>
                <p className="flex items-start gap-2">
                  <BuildingIcon className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <span>{demarche.lieu.nom}</span>
                </p>
              </div>

              <div className="mt-auto pt-6">
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                  {demarche.documents.length} document(s) à vérifier
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
