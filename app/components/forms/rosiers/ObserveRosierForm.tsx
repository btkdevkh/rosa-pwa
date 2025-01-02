import React, { FormEvent, useEffect, useState } from "react";
import SingleSelect, {
  OptionType,
} from "@/app/components/selects/SingleSelect";
import { stadePhenologiques } from "@/app/mockedData";
import { Observation } from "@/app/models/interfaces/Observation";
import { useSession } from "next-auth/react";
import { UserDetails } from "@/app/models/interfaces/UserDetails";
import toastError from "@/app/helpers/notifications/toastError";

type ObserveRosierFormProps = {
  rosierID: string | null;
};

const ObserveRosierForm = ({ rosierID }: ObserveRosierFormProps) => {
  const { data: sessions } = useSession();

  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState<{
    [key: string]: string;
  } | null>(null);
  const [isClearable, setIsClearable] = useState<boolean>(false);
  const [stadePheno, setStadePheno] = useState<OptionType | null>(null);
  const [nbTotalFeuilles, setNbTotalFeuilles] = useState<number | string>("");
  const [nbFeuilleToucheesParLaRouille, setNbFeuilleToucheesParLaRouille] =
    useState<number | string>("");
  const [intensiteAttaqueDeLaRouille, setIntensiteAttaqueDeLaRouille] =
    useState<number | string>("");
  const [nbFeuilleToucheesParEcidies, setNbFeuilleToucheesParEcidies] =
    useState<number | string>("");
  const [nbFeuilleToucheesParUredos, setNbFeuilleToucheesParUredos] = useState<
    number | string
  >("");
  const [nbFeuilleToucheesParTeleutos, setNbFeuilleToucheesParTeleutos] =
    useState<number | string>("");
  const [nbFeuilleToucheesParMarsonia, setNbFeuilleToucheesParMarsonia] =
    useState<number | string>("");
  const [comment, setComment] = useState<string>("");

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);
    setLoading(true);

    if (!sessions) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        userID: "L'identifiant de l'utilisateur n'est pas valide",
      }));
    }

    if (!rosierID) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        rosierID: "L'identifiant du rosier n'est pas valide",
      }));
    }

    // Validations des champs du nombre entier
    // nbTotalFeuilles
    if (!nbTotalFeuilles) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nbTotalFeuilles: "Veuillez renseigner le nombre total de feuilles",
      }));
    }

    if (!Number.isInteger(+nbTotalFeuilles)) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nbTotalFeuilles: "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParLaRouille
    if (
      nbFeuilleToucheesParLaRouille &&
      !Number.isInteger(+nbFeuilleToucheesParLaRouille)
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParLaRouille:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParEcidies
    if (
      nbFeuilleToucheesParEcidies &&
      !Number.isInteger(+nbFeuilleToucheesParEcidies)
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParEcidies:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParUredos
    if (
      nbFeuilleToucheesParUredos &&
      !Number.isInteger(+nbFeuilleToucheesParUredos)
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParUredos:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParTeleutos
    if (
      nbFeuilleToucheesParTeleutos &&
      !Number.isInteger(+nbFeuilleToucheesParTeleutos)
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParTeleutos:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParMarsonia
    if (
      nbFeuilleToucheesParMarsonia &&
      !Number.isInteger(+nbFeuilleToucheesParMarsonia)
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParMarsonia:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesPar... > nbTotalFeuilles
    if (
      +nbFeuilleToucheesParLaRouille > +nbTotalFeuilles ||
      +nbFeuilleToucheesParEcidies > +nbTotalFeuilles ||
      +nbFeuilleToucheesParUredos > +nbTotalFeuilles ||
      +nbFeuilleToucheesParTeleutos > +nbTotalFeuilles ||
      +nbFeuilleToucheesParMarsonia > +nbTotalFeuilles
    ) {
      const nbFeuilleToucheesParDisease =
        +nbFeuilleToucheesParLaRouille > +nbTotalFeuilles
          ? "nbFeuilleToucheesParLaRouille"
          : +nbFeuilleToucheesParEcidies > +nbTotalFeuilles
          ? "nbFeuilleToucheesParEcidies"
          : +nbFeuilleToucheesParUredos > +nbTotalFeuilles
          ? "nbFeuilleToucheesParUredos"
          : +nbFeuilleToucheesParTeleutos > +nbTotalFeuilles
          ? "nbFeuilleToucheesParTeleutos"
          : +nbFeuilleToucheesParMarsonia > +nbTotalFeuilles
          ? "nbFeuilleToucheesParMarsonia"
          : "";

      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        [nbFeuilleToucheesParDisease]:
          "Le nombre de feuilles touchées ne peut pas dépasser le nombre de feuilles total",
      }));
    }

    // Commentaire
    if (comment && comment.length > 500) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        comment: "Le commentaire ne peut pas dépasser 500 caractères",
      }));
    }

    const observation: Observation = {
      timestamp: new Date(),
      id_rosier: +rosierID,
      id_utilisateur: +(sessions.user as UserDetails).id_user_postgres,
      data: {
        stade_pheno: stadePheno?.value ?? null,
        nb_feuilles: +nbTotalFeuilles || 0,
        rouille: {
          freq: computeFrequenceObs(
            +nbFeuilleToucheesParLaRouille,
            +nbTotalFeuilles
          ),
          int: +intensiteAttaqueDeLaRouille || 0,
          nb: +nbFeuilleToucheesParLaRouille || 0,
        },
        ecidies: {
          freq: computeFrequenceObs(
            +nbFeuilleToucheesParEcidies,
            +nbTotalFeuilles
          ),
          nb: +nbFeuilleToucheesParEcidies || 0,
        },
        uredos: {
          freq: computeFrequenceObs(
            +nbFeuilleToucheesParUredos,
            +nbTotalFeuilles
          ),
          nb: +nbFeuilleToucheesParUredos || 0,
        },
        teleutos: {
          freq: computeFrequenceObs(
            +nbFeuilleToucheesParTeleutos,
            +nbTotalFeuilles
          ),
          nb: +nbFeuilleToucheesParTeleutos || 0,
        },
        marsonia: {
          freq: computeFrequenceObs(
            +nbFeuilleToucheesParMarsonia,
            +nbTotalFeuilles
          ),
          nb: +nbFeuilleToucheesParMarsonia || 0,
        },
      },
      commentaire: comment.length > 0 ? comment : null,
    };

    // intensiteAttaqueDeLaRouille
    if (observation.data.rouille.int > observation.data.rouille.freq) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        intensiteAttaqueDeLaRouille: `Le nombre d'intensité ne peut pas dépasser le nombre de fréquence: ${observation.data.rouille.freq}`,
      }));
    }

    console.log("observation :", observation);
    setLoading(false);
  };

  // Errors input
  useEffect(() => {
    if (inputErrors) {
      for (const inputError in inputErrors) {
        toastError(inputErrors[inputError], `error-${inputError}`);
      }
    }
  }, [inputErrors]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Stade phenologique */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Stade phénologique</p>
            <SingleSelect
              data={stadePhenologiques}
              isClearable={isClearable}
              selectedOption={stadePheno}
              setSelectedOption={option => setStadePheno(option)}
              setIsClearable={setIsClearable}
            />
            <small>xxx le xx/xx</small>
          </div>

          {/* Nombre total de feuilles */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre total de feuilles <span className="text-error">*</span>
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbTotalFeuilles}
                onChange={e => setNbTotalFeuilles(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbTotalFeuilles"] && (
              <p className="text-error">{inputErrors["nbTotalFeuilles"]}</p>
            )}

            <small>xxx le xx/xx</small>
          </div>

          {/* Nombre de feuilles touchées par la rouille */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par la rouille
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParLaRouille}
                onChange={e => setNbFeuilleToucheesParLaRouille(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParLaRouille"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParLaRouille"]}
              </p>
            )}

            <small>xxx le xx/xx</small>
          </div>

          {/* Intensité d'attaque de la rouille */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Intensité d&apos;attaque de la rouille</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={intensiteAttaqueDeLaRouille}
                onChange={e => setIntensiteAttaqueDeLaRouille(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["intensiteAttaqueDeLaRouille"] && (
              <p className="text-error">
                {inputErrors["intensiteAttaqueDeLaRouille"]}
              </p>
            )}

            <small>xxx le xx/xx</small>
          </div>

          {/* Nombre de feuilles touchées par écidies */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par écidies</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParEcidies}
                onChange={e => setNbFeuilleToucheesParEcidies(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParEcidies"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParEcidies"]}
              </p>
            )}

            <small>xxx le xx/xx</small>
          </div>

          {/* Nombre de feuilles touchées par urédos */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par urédos</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParUredos}
                onChange={e => setNbFeuilleToucheesParUredos(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParUredos"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParUredos"]}
              </p>
            )}

            <small>xxx le xx/xx</small>
          </div>

          {/* Nombre de feuilles touchées par téleutos */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par téleutos
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParTeleutos}
                onChange={e => setNbFeuilleToucheesParTeleutos(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParTeleutos"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParTeleutos"]}
              </p>
            )}

            <small>xxx le xx/xx</small>
          </div>

          {/* Nombre de feuilles touchées par marsonia */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par marsonia
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParMarsonia}
                onChange={e => setNbFeuilleToucheesParMarsonia(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParMarsonia"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParMarsonia"]}
              </p>
            )}

            <small>xxx le xx/xx</small>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Commentaire</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-9 p-2">
              <input
                type="text"
                className="grow"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["comment"] && (
              <p className="text-error">{inputErrors["comment"]}</p>
            )}

            <small>&quot;Rien à signaler&quot; le xx/xx</small>
          </div>

          <button className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md">
            {loading ? (
              <span className="loading loading-spinner text-txton3"></span>
            ) : (
              "Valider"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ObserveRosierForm;

// Helpers
const computeFrequenceObs = (
  nbFeuilleTouchees: number,
  nbTotalFeuilles: number
) => {
  return Number(((+nbFeuilleTouchees / +nbTotalFeuilles) * 100).toFixed(2));
};
