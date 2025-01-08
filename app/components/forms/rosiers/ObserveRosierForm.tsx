import React, { FormEvent, useEffect, useState } from "react";
import SingleSelect, {
  OptionType,
} from "@/app/components/selects/SingleSelect";
import { stadePhenologiques } from "@/app/mockedData";
import { Observation } from "@/app/models/interfaces/Observation";
import { useSession } from "next-auth/react";
import { UserDetails } from "@/app/models/interfaces/UserDetails";
import toastError from "@/app/helpers/notifications/toastError";
import addObservation from "@/app/services/rosiers/observations/addObservation";
import { useRouter, useSearchParams } from "next/navigation";
import updateObservation from "@/app/services/rosiers/observations/updateObservation";

type ObserveRosierFormProps = {
  rosierID: string | null;
  lastObservation: Observation | null;
  lastObservationDate: string | null;
  editableDelayPassed: string | boolean | null;
};

const ObserveRosierForm = ({
  rosierID,
  lastObservation,
  lastObservationDate,
  editableDelayPassed,
}: ObserveRosierFormProps) => {
  const router = useRouter();
  const { data: sessions } = useSession();

  const searchParams = useSearchParams();
  const plotParamID = searchParams.get("plotID");
  const plotParamName = searchParams.get("plotName");

  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState<{
    [key: string]: string;
  } | null>(null);
  const [isClearable, setIsClearable] = useState<boolean>(false);

  const stadePhenologique = stadePhenologiques.find(
    stade_pheno => stade_pheno.value === lastObservation?.data.stade_pheno
  );

  // Champs
  const [stadePheno, setStadePheno] = useState<OptionType | null>(
    !editableDelayPassed ? stadePhenologique ?? null : null
  );
  const [nbTotalFeuilles, setNbTotalFeuilles] = useState<number | string>(
    !editableDelayPassed ? lastObservation?.data.nb_feuilles ?? "" : ""
  );
  const [nbFeuilleToucheesParLaRouille, setNbFeuilleToucheesParLaRouille] =
    useState<number | string>(
      !editableDelayPassed ? lastObservation?.data.rouille?.nb ?? "" : ""
    );
  const [intensiteAttaqueDeLaRouille, setIntensiteAttaqueDeLaRouille] =
    useState<number | string>(
      !editableDelayPassed ? lastObservation?.data.rouille?.int ?? "" : ""
    );
  const [nbFeuilleToucheesParEcidies, setNbFeuilleToucheesParEcidies] =
    useState<number | string>(
      !editableDelayPassed ? lastObservation?.data.ecidies?.nb ?? "" : ""
    );
  const [nbFeuilleToucheesParUredos, setNbFeuilleToucheesParUredos] = useState<
    number | string
  >(!editableDelayPassed ? lastObservation?.data.uredos?.nb ?? "" : "");
  const [nbFeuilleToucheesParTeleutos, setNbFeuilleToucheesParTeleutos] =
    useState<number | string>(
      !editableDelayPassed ? lastObservation?.data.teleutos?.nb ?? "" : ""
    );
  const [nbFeuilleToucheesParMarsonia, setNbFeuilleToucheesParMarsonia] =
    useState<number | string>(
      !editableDelayPassed ? lastObservation?.data.marsonia?.nb ?? "" : ""
    );
  const [comment, setComment] = useState<string>(
    !editableDelayPassed ? lastObservation?.commentaire ?? "" : ""
  );

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // ID user
    if (!sessions) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        userID: "L'identifiant de l'utilisateur n'est pas valide",
      }));
    }

    // ID rosier
    if (!rosierID) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        rosierID: "L'identifiant du rosier n'est pas valide",
      }));
    }

    // Verif des champs du nombre entier
    // nbTotalFeuilles
    if (nbTotalFeuilles.toString().length === 0) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        nbTotalFeuilles: "Veuillez renseigner le nombre total de feuilles",
      }));
    }
    if (!isIntegerBetween0And999(nbTotalFeuilles)) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        nbTotalFeuilles: "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParLaRouille
    if (!isIntegerBetween0And999(nbFeuilleToucheesParLaRouille)) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParLaRouille:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }
    // intensiteAttaqueDeLaRouille
    if (
      (intensiteAttaqueDeLaRouille.toString().length > 0 &&
        +intensiteAttaqueDeLaRouille < 0) ||
      (intensiteAttaqueDeLaRouille.toString().length > 0 &&
        +intensiteAttaqueDeLaRouille > 100)
    ) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        intensiteAttaqueDeLaRouille:
          "L'intensité doit être comprise entre 0 et 100",
      }));
    }

    // nbFeuilleToucheesParEcidies
    if (!isIntegerBetween0And999(nbFeuilleToucheesParEcidies)) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParEcidies:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParUredos
    if (!isIntegerBetween0And999(nbFeuilleToucheesParUredos)) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParUredos:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParTeleutos
    if (!isIntegerBetween0And999(nbFeuilleToucheesParTeleutos)) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParTeleutos:
          "Le nombre doit être un entier compris entre 0 et 999",
      }));
    }

    // nbFeuilleToucheesParMarsonia
    if (!isIntegerBetween0And999(nbFeuilleToucheesParMarsonia)) {
      setLoading(false);
      setInputErrors(o => ({
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
      setInputErrors(o => ({
        ...o,
        [nbFeuilleToucheesParDisease]:
          "Le nombre de feuilles touchées ne peut pas dépasser le nombre de feuilles total",
      }));
    }

    // Commentaire
    if (comment && comment.length > 500) {
      setLoading(false);
      setInputErrors(o => ({
        ...o,
        comment: "Le commentaire ne peut pas dépasser 500 caractères",
      }));
    }

    // Observation obj
    const observation: Observation = {
      timestamp:
        lastObservation && !editableDelayPassed
          ? lastObservation.timestamp
          : new Date(),
      id_rosier: +rosierID,
      id_utilisateur: +(sessions.user as UserDetails).id_user_postgres,
      data: {
        stade_pheno: stadePheno?.value ?? null,
        nb_feuilles: +nbTotalFeuilles,
      },
      commentaire: comment.length > 0 ? comment : null,
    };

    // Add sup properties to observation obj
    // rouille
    if (
      nbTotalFeuilles.toString().length > 0 &&
      nbFeuilleToucheesParLaRouille.toString().length > 0
    ) {
      observation.data.rouille = {
        ...observation.data.rouille,
        freq: computeFrequenceObs(
          +nbFeuilleToucheesParLaRouille,
          +nbTotalFeuilles
        ),
        nb: +nbFeuilleToucheesParLaRouille,
      };
    }
    if (intensiteAttaqueDeLaRouille.toString().length > 0) {
      observation.data.rouille = {
        ...observation.data.rouille,
        int: +intensiteAttaqueDeLaRouille,
      };
    }

    // écidies
    if (
      nbTotalFeuilles.toString().length > 0 &&
      nbFeuilleToucheesParEcidies.toString().length > 0
    ) {
      observation.data.ecidies = {
        ...observation.data.ecidies,
        freq: computeFrequenceObs(
          +nbFeuilleToucheesParEcidies,
          +nbTotalFeuilles
        ),
        nb: +nbFeuilleToucheesParEcidies,
      };
    }

    // urédos
    if (
      nbTotalFeuilles.toString().length > 0 &&
      nbFeuilleToucheesParUredos.toString().length > 0
    ) {
      observation.data.uredos = {
        ...observation.data.uredos,
        freq: computeFrequenceObs(
          +nbFeuilleToucheesParUredos,
          +nbTotalFeuilles
        ),
        nb: +nbFeuilleToucheesParUredos,
      };
    }

    // téleutos
    if (
      nbTotalFeuilles.toString().length > 0 &&
      nbFeuilleToucheesParTeleutos.toString().length > 0
    ) {
      observation.data.teleutos = {
        ...observation.data.teleutos,
        freq: computeFrequenceObs(
          +nbFeuilleToucheesParTeleutos,
          +nbTotalFeuilles
        ),
        nb: +nbFeuilleToucheesParTeleutos,
      };
    }

    // marsonia
    if (
      nbTotalFeuilles.toString().length > 0 &&
      nbFeuilleToucheesParMarsonia.toString().length > 0
    ) {
      observation.data.marsonia = {
        ...observation.data.marsonia,
        freq: computeFrequenceObs(
          +nbFeuilleToucheesParMarsonia,
          +nbTotalFeuilles
        ),
        nb: +nbFeuilleToucheesParMarsonia,
      };
    }

    console.log("inputErrors :", inputErrors);

    // console.log("editableDelayPassed :", editableDelayPassed);
    console.log("observation :", observation);
    setLoading(false);
    return;

    // Process to DB
    // Create
    if (editableDelayPassed == null || editableDelayPassed) {
      const response = await addObservation(observation);
      setLoading(false);

      if (response && response.status === 200) {
        router.push(
          `/observations/plots/plot?plotID=${plotParamID}&plotName=${plotParamName}`
        );
      }
    }

    // Update
    if (!editableDelayPassed) {
      if (lastObservation && lastObservation.id) {
        const response = await updateObservation(
          observation,
          +lastObservation.id
        );
        setLoading(false);

        if (response && response.status === 200) {
          router.push(
            `/observations/plots/plot?plotID=${plotParamID}&plotName=${plotParamName}`
          );
        }
      }
    }
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
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4">
          {/* Stade phenologique */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Stade phénologique</p>
            <SingleSelect
              data={stadePhenologiques}
              isClearable={isClearable || stadePheno ? true : false}
              selectedOption={stadePheno}
              setSelectedOption={option => setStadePheno(option)}
              setIsClearable={setIsClearable}
            />

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.stade_pheno ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Nombre total de feuilles */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre total de feuilles <span className="text-error">*</span>
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbTotalFeuilles}
                onChange={e => setNbTotalFeuilles(e.target.value)}
                min="0"
                max="999"
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbTotalFeuilles"] && (
              <p className="text-error">{inputErrors["nbTotalFeuilles"]}</p>
            )}

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.nb_feuilles ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Nombre de feuilles touchées par la rouille */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par la rouille
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParLaRouille}
                onChange={e => setNbFeuilleToucheesParLaRouille(e.target.value)}
                min="0"
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParLaRouille"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParLaRouille"]}
              </p>
            )}

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.rouille?.nb ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Intensité d'attaque de la rouille */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Intensité d&apos;attaque de la rouille</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={intensiteAttaqueDeLaRouille}
                onChange={e => setIntensiteAttaqueDeLaRouille(e.target.value)}
                min="0"
                step="0.01"
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["intensiteAttaqueDeLaRouille"] && (
              <p className="text-error">
                {inputErrors["intensiteAttaqueDeLaRouille"]}
              </p>
            )}

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.rouille?.int ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Nombre de feuilles touchées par écidies */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par écidies</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParEcidies}
                onChange={e => setNbFeuilleToucheesParEcidies(e.target.value)}
                min="0"
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParEcidies"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParEcidies"]}
              </p>
            )}

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.ecidies?.nb ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Nombre de feuilles touchées par urédos */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par urédos</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParUredos}
                onChange={e => setNbFeuilleToucheesParUredos(e.target.value)}
                min="0"
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParUredos"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParUredos"]}
              </p>
            )}

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.uredos?.nb ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Nombre de feuilles touchées par téleutos */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par téleutos
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParTeleutos}
                onChange={e => setNbFeuilleToucheesParTeleutos(e.target.value)}
                min="0"
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParTeleutos"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParTeleutos"]}
              </p>
            )}

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.teleutos?.nb ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Nombre de feuilles touchées par marsonia */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">
              Nombre de feuilles touchées par marsonia
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParMarsonia}
                onChange={e => setNbFeuilleToucheesParMarsonia(e.target.value)}
                min="0"
              />
            </label>

            {/* Error */}
            {inputErrors && inputErrors["nbFeuilleToucheesParMarsonia"] && (
              <p className="text-error">
                {inputErrors["nbFeuilleToucheesParMarsonia"]}
              </p>
            )}

            {editableDelayPassed && lastObservation && (
              <small>
                {lastObservation.data.marsonia?.nb ?? "Non renseigné"} le{" "}
                {lastObservationDate}
              </small>
            )}
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Commentaire</p>
            <label className="form-control h-20 mb-0">
              <textarea
                className="textarea w-full textarea-primary border-txton2 focus-within:border-2"
                value={comment}
                onChange={e => setComment(e.target.value)}
              ></textarea>
            </label>

            {/* Error */}
            {inputErrors && inputErrors["comment"] && (
              <p className="text-error">{inputErrors["comment"]}</p>
            )}

            {editableDelayPassed && lastObservation ? (
              <small>
                {`"${lastObservation.commentaire ?? "Rien à signaler"}"`} le{" "}
                {lastObservationDate}
              </small>
            ) : (
              <>
                {editableDelayPassed && (
                  <small>
                    &quot;Rien à signaler&quot; le {lastObservationDate}
                  </small>
                )}
              </>
            )}
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
  nbFeuilleTouchees: number | string,
  nbTotalFeuilles: number
) => {
  return +nbTotalFeuilles === 0
    ? 0
    : Number(((+nbFeuilleTouchees / +nbTotalFeuilles) * 100).toFixed(2));
};

const isIntegerBetween0And999 = (nbInteger: string | number) => {
  if (
    !Number.isInteger(+nbInteger) ||
    (Number.isInteger(+nbInteger) && +nbInteger < 0) ||
    (Number.isInteger(+nbInteger) && +nbInteger > 999)
  ) {
    return false;
  }

  return true;
};
