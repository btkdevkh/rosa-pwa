import { Axe } from "./Axe";

export interface AxeExtended extends Axe {
  id_mocked_axe: string;
  indicator_nom: string;
  id_indicator?: string | number;
}
