export interface Rosier {
  uid?: string;
  nom: string;
  editionDelay: boolean;
  archived: boolean;
  map_zone: { uid: string; nom: string };
}
