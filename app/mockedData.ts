import { v4 as uuid } from "uuid";
import { Exploitation } from "./models/interfaces/Exploitation";
import { Parcelle } from "./models/interfaces/Parcelle";
import { Rosier } from "./models/interfaces/Rosier";
import { RosierHauteur, RosierPosition } from "./models/enums/RosierInfosEnum";
import { StadePhenosEnum } from "./models/enums/StadePhenosEnum";
import { PeriodTypeEnum } from "./models/enums/PeriodTypeEnum";
import { OptionType } from "./models/types/OptionType";
import { Indicateur } from "./models/interfaces/Indicateur";
import { DataVisualization } from "./models/enums/DataVisualization";
import { AxeUnite } from "./models/enums/AxeEnum";
import { AxeExtended } from "./models/interfaces/AxeExtended";

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

// Generate an array of objects
export const colors: { id: string; color: string }[] = Object.entries(
  DataVisualization
).map(
  ([key, value]) =>
    ({
      id: key,
      color: value,
    } as { id: string; color: string })
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

// Axe
export const axeMockedData: AxeExtended[] = [
  // Percentage axe
  {
    id_mocked_axe: uuid(),
    nom: "Fréquence et intensité (%)",
    indicator_nom: "Fréquence écidies",
    provenance: "Rospot",
    min: null,
    max: null,
    unite: AxeUnite.PERCENTAGE,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Fréquence et intensité (%)",
    indicator_nom: "Fréquence marsonia",
    provenance: "Rospot",
    min: null,
    max: null,
    unite: AxeUnite.PERCENTAGE,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Fréquence et intensité (%)",
    indicator_nom: "Fréquence rouille",
    provenance: "Rospot",
    min: null,
    max: null,
    unite: AxeUnite.PERCENTAGE,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Fréquence et intensité (%)",
    indicator_nom: "Fréquence téleutos",
    provenance: "Rospot",
    min: null,
    max: null,
    unite: AxeUnite.PERCENTAGE,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Fréquence et intensité (%)",
    indicator_nom: "Fréquence urédos",
    provenance: "Rospot",
    min: null,
    max: null,
    unite: AxeUnite.PERCENTAGE,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Fréquence et intensité (%)",
    indicator_nom: "Intensité rouille",
    provenance: "Rospot",
    min: null,
    max: null,
    unite: AxeUnite.PERCENTAGE,
  },

  // Number axe
  {
    id_mocked_axe: uuid(),
    nom: "Nombre de feuilles",
    indicator_nom: "Nombre de feuilles",
    provenance: "Rospot",
    min: null,
    max: null,
    unite: null,
  },

  // Special axe
  {
    id_mocked_axe: uuid(),
    nom: "Tension (V)",
    indicator_nom: "Humectation foliaire",
    provenance: "Weenat",
    min: null,
    max: null,
    unite: AxeUnite.TENSION_V,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Humidité (%)",
    indicator_nom: "Humidité",
    provenance: "Weenat",
    min: null,
    max: null,
    unite: AxeUnite.PERCENTAGE,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Précipitations (mm)",
    indicator_nom: "Précipitations",
    provenance: "Weenat",
    min: null,
    max: null,
    unite: AxeUnite.MM,
  },
  {
    id_mocked_axe: uuid(),
    nom: "Température (°C)",
    indicator_nom: "Température maximum",
    provenance: "Weenat",
    min: null,
    max: null,
    unite: AxeUnite.C,
  },
];

// Indicateurs
export const indicateurs: Indicateur[] = [
  {
    id_indicator: uuid(),
    nom: "Fréquence écidies",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Rospot",
    isPercentageAxe: true,
    isNumberAxe: null,
  },
  {
    id_indicator: uuid(),
    nom: "Fréquence marsonia",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Rospot",
    isPercentageAxe: true,
    isNumberAxe: null,
  },
  {
    id_indicator: uuid(),
    nom: "Fréquence rouille",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Rospot",
    isPercentageAxe: true,
    isNumberAxe: null,
  },
  {
    id_indicator: uuid(),
    nom: "Fréquence téleutos",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Rospot",
    isPercentageAxe: true,
    isNumberAxe: null,
  },
  {
    id_indicator: uuid(),
    nom: "Fréquence urédos",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Rospot",
    isPercentageAxe: true,
    isNumberAxe: null,
  },
  {
    id_indicator: uuid(),
    nom: "Intensité rouille",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Rospot",
    isPercentageAxe: true,
    isNumberAxe: null,
  },
  // Number axe
  {
    id_indicator: uuid(),
    nom: "Nombre de feuilles",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Rospot",
    isPercentageAxe: null,
    isNumberAxe: true,
  },
  {
    id_indicator: uuid(),
    nom: "Humectation foliaire",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Weenat",
    isPercentageAxe: null,
    isNumberAxe: true,
  },
  {
    id_indicator: uuid(),
    nom: "Humidité",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Weenat",
    isPercentageAxe: null,
    isNumberAxe: true,
  },
  {
    id_indicator: uuid(),
    nom: "Précipitations",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Weenat",
    isPercentageAxe: null,
    isNumberAxe: true,
  },
  {
    id_indicator: uuid(),
    nom: "Température maximum",
    params: {
      source: "SRC",
    },
    data_field: null,
    type_viz: null,
    id_axe: null,
    provenance: "Weenat",
    isPercentageAxe: null,
    isNumberAxe: true,
  },
];

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
