export interface Plot {
  uid?: string;
  nom: string;
  map_expl?: { uid: string; nom: string };
  map_rosier?: { uid: string; nom: string; archived: boolean };
  archived?: boolean;
  delayPassed?: boolean;
}
