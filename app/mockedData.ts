import { OptionType } from "./components/selects/SingleSelect";
import { Exploitation } from "./models/interfaces/Exploitation";
import { Parcelle } from "./models/interfaces/Parcelle";
import { Rosier } from "./models/interfaces/Rosier";
import { RosierHauteur, RosierPosition } from "./models/enums/RosierInfosEnum";

// Fake data
export const exploitations: Exploitation[] = [
  {
    id: 1,
    nom: "Test 1",
  },
  {
    id: 2,
    nom: "Test 2",
  },
];

export const exploitationOptions = exploitations.map(expl => ({
  value: expl.nom,
  label: expl.nom,
  id: expl.id,
}));

export const parcelles: Parcelle[] = [
  {
    id: 1,
    nom: "Parcelle B",
    id_exploitation: 1,
    est_archive: false,
  },
  {
    id: 3,
    nom: "TNT",
    id_exploitation: 1,
    est_archive: true,
  },
  {
    id: 2,
    nom: "Parcelle A",
    id_exploitation: 1,
    est_archive: false,
  },
];

export const rosiersFake: Rosier[] = [
  {
    id: 1,
    nom: "Rosier A1",
    est_archive: false,
    id_parcelle: 1,
    hauteur: RosierHauteur.DOWN,
    position: RosierPosition.INTERIOR,
  },
  {
    id: 2,
    nom: "Rosier A2",
    est_archive: false,
    id_parcelle: 2,
    hauteur: RosierHauteur.HIGH,
    position: RosierPosition.OUTSIDE,
  },
  {
    id: 3,
    nom: "Rosier A3",
    est_archive: true,
    id_parcelle: 2,
    hauteur: RosierHauteur.DOWN,
    position: RosierPosition.INTERIOR,
  },
  {
    id: 4,
    nom: "Rosier A4",
    est_archive: false,
    id_parcelle: 2,
    hauteur: RosierHauteur.HIGH,
    position: RosierPosition.OUTSIDE,
  },
];

export const stadePhenos: OptionType[] = [
  {
    id: 1,
    value: "00 - Repos hivernal ou dormance",
    label: "00 - Repos hivernal ou dormance",
  },
  {
    id: 2,
    value: "01 - Début gonflement des bourgeons ",
    label: "01 - Début gonflement des bourgeons ",
  },
  {
    id: 3,
    value: "03 - Fin gonflement des bourgeons ",
    label: "03 - Fin gonflement des bourgeons",
  },
];
