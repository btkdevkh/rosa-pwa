import { v4 as uuid } from "uuid";
import { Exploitation } from "./models/interfaces/Exploitation";
import { Parcelle } from "./models/interfaces/Parcelle";
import { Rosier } from "./models/interfaces/Rosier";
import { RosierHauteur, RosierPosition } from "./models/enums/RosierInfosEnum";
import { StadePhenosEnum } from "./models/enums/StadePhenosEnum";
import { PeriodTypeEnum } from "./models/enums/PeriodTypeEnum";
import { OptionType } from "./models/types/OptionType";
import { Indicateur } from "./models/interfaces/Indicateur";

// Generate an array of objects
export const stadePhenologiques: OptionType[] = Object.entries(
  StadePhenosEnum
).map(
  ([key, value]) =>
    ({
      id: key,
      value: value,
      label: value,
    } as unknown as OptionType)
);

// Generate période type array

export const periodsType: OptionType[] = Object.entries(PeriodTypeEnum).map(
  ([key, value]) =>
    ({
      id: key,
      value: key,
      label: value,
    } as unknown as OptionType)
);

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
    hauteur: RosierHauteur.LOW,
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
    hauteur: RosierHauteur.LOW,
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

// Indicateurs
export const indicateurs: Indicateur[] = [
  {
    id: uuid(),
    nom: "Fréquence écidies",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Fréquence marsonia",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Fréquence rouille",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Fréquence téleutos",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Fréquence urédos",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Intensité rouille",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Nombre de feuilles",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Humectation foliaire",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Humidité",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Précipitations",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
  {
    id: uuid(),
    nom: "Température maximum",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
  },
];
