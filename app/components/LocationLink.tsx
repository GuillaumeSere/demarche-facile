'use client';

interface LocationLinkProps {
  nom: string;
  lien?: string;
  className?: string;
}

export default function LocationLink({ nom, lien, className = "text-sm text-blue-600 hover:underline cursor-pointer" }: LocationLinkProps) {
  if (!lien) {
    return <span className="text-sm text-gray-600">{nom}</span>;
  }

  return (
    <span 
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        window.open(lien, '_blank');
      }}
      className={className}
    >
      {nom}
    </span>
  );
}
