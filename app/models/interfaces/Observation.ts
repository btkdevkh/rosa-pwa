export interface Observation {
  id?: number;
  timestamp?: Date;
  id_utilisateur: number;
  id_rosier: number;
  data: {
    uredos: { freq: number | null; nb: number | null };
    teleutos: { freq: number | null; nb: number | null };
    rouille: { freq?: number | null; nb?: number | null; int?: number | null };
    marsonia: { freq: number | null; nb: number | null };
    ecidies: { freq: number | null; nb: number | null };
    nb_feuilles: number | null;
    stade_pheno: string | null;
  };
  commentaire: string | null;
}
