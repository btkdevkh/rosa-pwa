import { JsonValue } from "@prisma/client/runtime/library";

export interface Indicateur {
  id?: number | string;
  nom: string | null;
  params: JsonValue | null;
  data_field: string | null;
  type_viz: string | null;
  id_axe: number | null;
  color?: string | null;
}
