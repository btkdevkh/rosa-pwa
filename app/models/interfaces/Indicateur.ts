export interface Indicateur {
  id?: number;
  nom: string | null;
  params: IndicateurParams;
  data_field: string | null;
  type_viz: string | null;
  id_axe: number | null;
}

type IndicateurParams = {
  source: string;
};
