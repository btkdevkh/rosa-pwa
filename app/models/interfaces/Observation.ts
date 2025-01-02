export interface Observation {
  id?: number;
  timestamp?: Date;
  id_utilisateur: number;
  id_rosier: number;
  data: {
    uredos: { freq: number; nb: number };
    teleutos: { freq: number; nb: number };
    rouille: { freq: number; nb: number; int: number };
    marsonia: { freq: number; nb: number };
    ecidies: { freq: number; nb: number };
    nb_feuilles: number;
    stade_pheno: string | null;
  };
  commentaire: string | null;
}
