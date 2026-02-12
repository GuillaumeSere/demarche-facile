export type Demarche = {
  slug: string;
  titre: string;
  documents: string[];
  prix: string;
  delai: string;
  lieu: {
    nom: string;
    lien?: string;
  };
};
