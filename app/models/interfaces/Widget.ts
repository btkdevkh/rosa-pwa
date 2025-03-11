export interface Widget {
  id?: number;
  id_dashboard: number;
  type: string;
  params: WidgetParams;
}

export type WidgetParams = {
  nom: string;
  hauteur: WidgetHauteurEnum;
  index: number;
  type_valeur?: number;
  date_auto: boolean;
  mode_date_auto?: string;
  date_debut_manuelle?: Date | null;
  date_fin_manuelle?: Date | null;
  filtres?: { type: string; val: number }[];
  aggregation?: boolean;
  mode_aggregation?: {
    nb_jours: number;
  };
  indicateurs?: {
    couleur: string;
    id: number;
    min_max: number[];
  }[];
  id_plot?: number | null;
  axes?: { nom_axe: string; id_indicator: number }[];
};

export enum WidgetTypeEnum {
  GRAPHIQUE = "graphique",
}

export enum WidgetHauteurEnum {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}
