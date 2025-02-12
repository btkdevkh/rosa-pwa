import { Widget } from "../../interfaces/Widget";
import { Observation } from "../../interfaces/Observation";
import { Indicateurs } from "@prisma/client";

export type ObservationWidget = {
  observations: Observation[];
  indicateurs: Indicateurs[];
  widget: Widget;
};
