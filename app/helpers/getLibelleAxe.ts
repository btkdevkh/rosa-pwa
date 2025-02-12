import { Axes } from "@prisma/client";

export function getLibelleAxe(referentielAxe: Axes[], id: number | undefined) {
  const axe = referentielAxe.find(ref => ref.id === id);
  if (axe && axe.nom) {
    let libelle = axe.nom;
    if (axe.unite) {
      libelle = libelle + " (" + axe.unite + ")";
    }
    return libelle;
  }
  return "";
}
