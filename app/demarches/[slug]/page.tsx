import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRightIcon,
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  WalletIcon,
} from "../../components/Icons";
import LocateMe from "../../components/LocateMe";
import LocationLink from "../../components/LocationLink";
import demarches from "../../data/demarches.json";
import type { Demarche } from "../../types/demarche";

async function getDemarche(slug: string) {
  const allDemarches = demarches as Demarche[];
  return allDemarches.find((demarche) => demarche.slug === slug) || null;
}

type Props = {
  params:
    | {
        slug: string;
      }
    | Promise<{
        slug: string;
      }>;
};

export default async function DemarcheDetail({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) return notFound();

  const demarche = await getDemarche(slug);

  if (!demarche) return notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/demarches"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sky-200 transition hover:text-white"
          >
            <ArrowRightIcon className="size-4 rotate-180" />
            Retour aux démarches
          </Link>
          <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-sky-300">
                Fiche pratique
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                {demarche.titre}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Retrouvez les informations essentielles avant de préparer votre
                dossier ou de contacter l&apos;organisme compétent.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-sm font-semibold text-slate-300">Documents</p>
              <p className="mt-1 text-3xl font-bold">{demarche.documents.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                  <WalletIcon className="size-5" />
                </div>
                <p className="text-sm font-semibold text-slate-500">Tarif</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  {demarche.prix}
                </p>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
                  <ClockIcon className="size-5" />
                </div>
                <p className="text-sm font-semibold text-slate-500">Délai moyen</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  {demarche.delai}
                </p>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 grid size-10 place-items-center rounded-lg bg-amber-50 text-amber-700">
                  <BuildingIcon className="size-5" />
                </div>
                <p className="text-sm font-semibold text-slate-500">Lieu</p>
                <LocationLink
                  nom={demarche.lieu.nom}
                  lien={demarche.lieu.lien}
                  className="mt-1 inline-flex text-xl font-bold text-blue-700 hover:underline"
                />
              </article>
            </div>

            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
                  <FileTextIcon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase text-blue-700">
                    À préparer
                  </p>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Documents nécessaires
                  </h2>
                </div>
              </div>

              <ul className="space-y-3">
                {demarche.documents.map((doc, index) => (
                  <li
                    key={`${doc}-${index}`}
                    className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                    <span className="text-sm leading-6 text-slate-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg bg-slate-100 text-slate-800">
                  <BuildingIcon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase text-slate-500">
                    Service proche
                  </p>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Trouver une mairie
                  </h2>
                </div>
              </div>
              <LocateMe />
            </article>
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Avant de commencer
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
              <p>
                Vérifiez que vos justificatifs sont récents et correspondent au
                nom utilisé dans votre demande.
              </p>
              <p>
                Les délais peuvent varier selon votre commune, la période de
                l&apos;année et la disponibilité des rendez-vous.
              </p>
              <LocationLink
                nom={`Ouvrir ${demarche.lieu.nom}`}
                lien={demarche.lieu.lien}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
