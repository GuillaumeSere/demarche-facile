import Link from "next/link";
import { BuildingIcon, ClipboardCheckIcon, ShieldCheckIcon } from "./Icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.8fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3 text-white">
              <span className="grid size-10 place-items-center rounded-lg bg-blue-600">
                <ClipboardCheckIcon className="size-5" />
              </span>
              <div>
                <p className="font-bold">Démarche Facile</p>
                <p className="text-xs text-slate-400">Orientation administrative</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Un point de départ clair pour identifier les documents, les délais
              et le service compétent avant de vous déplacer.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-white">Navigation</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-slate-400 transition hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/demarches"
                  className="text-slate-400 transition hover:text-white"
                >
                  Toutes les démarches
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-white">Repères</h2>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-3">
                <ShieldCheckIcon className="mt-0.5 size-4 text-emerald-400" />
                Informations structurées pour préparer votre dossier.
              </li>
              <li className="flex gap-3">
                <BuildingIcon className="mt-0.5 size-4 text-sky-300" />
                Liens directs vers les services publics utiles.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Démarche Facile. Tous droits réservés.</p>
          <p>Ce site aide à s&apos;orienter et ne remplace pas les services officiels.</p>
        </div>
      </div>
    </footer>
  );
}
