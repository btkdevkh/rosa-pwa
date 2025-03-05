export interface Observation {
  id?: number;
  id_utilisateur: number;
  id_rosier: number;
  data: {
    nb_feuilles: number | string;
    uredos?: { freq?: number | null; nb?: number | null };
    teleutos?: { freq?: number | null; nb?: number | null };
    rouille?: { freq?: number | null; nb?: number | null; int?: number | null };
    marsonia?: { freq?: number | null; nb?: number | null };
    ecidies?: { freq?: number | null; nb?: number | null };

    // Weenat
    humectation_foliaire?: { nb?: number | null };
    humidite?: { freq?: number | null; nb?: number | null };
    precipitations?: { nb?: number | null };
    temperature_max?: { nb?: number | null };
    stade_pheno?: string | null;
  };
  timestamp?: Date;
  commentaire?: string | null;
  todoIcon?: boolean;
  okIcon?: boolean;
  delai_passed?: boolean;
}
