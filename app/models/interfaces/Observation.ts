import { Timestamp } from "firebase/firestore";

export interface Observation {
  id?: number;
  timestamp?: Timestamp;
  id_utilisateur: number;
  id_rosier: number;
  data: JSON;
  commentaire?: string;
}
