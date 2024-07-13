

export type Etudiant = {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  filiere_id: number;
  annee_id: number;
  email: string;
  biographie: string;
};
export type Choix = {
  theme: string;
  choix1: string;
  choix2: string;
};
export type Memoire = {
  theme: string;
  choix1: string;
  choix2: string;
};
export type Jury = {
  numero: string;
  president: string;
  examinateur: string;
  rapporteur: string;

};
export type Enseignant = {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  departement_id: number;
  grade_id: number;
  annee_id: number;
  email: string;
  biographie: string;
};
