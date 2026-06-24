"use client";

interface LocationLinkProps {
  nom: string;
  lien?: string;
  className?: string;
}

export default function LocationLink({
  nom,
  lien,
  className = "text-sm font-semibold text-blue-700 hover:underline",
}: LocationLinkProps) {
  if (!lien) {
    return <span className="text-sm text-slate-600">{nom}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => window.open(lien, "_blank", "noopener,noreferrer")}
      className={`text-left ${className}`}
    >
      {nom}
    </button>
  );
}
