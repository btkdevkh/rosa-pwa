import { InputJsonValue } from "@prisma/client/runtime/library";

export interface Indicateur {
  id?: number;
  nom?: string | null;
  params: InputJsonValue | undefined;
  data_field: string | null;
  type_viz: string | null;
  id_axe: number | null;
  color?: string | null;
  provenance?: string | null;
  isPercentageAxe?: boolean | null;
  isNumberAxe?: boolean | null;
  min_max?: [number, number] | null;
  id_indicator?: string | number;
  axe_nom?: string | null;
}
