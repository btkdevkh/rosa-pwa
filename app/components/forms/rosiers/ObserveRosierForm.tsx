import { FormEvent, useEffect, useState } from "react";
import SingleSelect from "@/app/components/selects/SingleSelect";
import { stadePhenologiques } from "@/app/mockedData";
import { Observation } from "@/app/models/interfaces/Observation";
import { useSession } from "next-auth/react";
import { UserDetails } from "@/app/models/interfaces/UserDetails";
import toastError from "@/app/helpers/notifications/toastError";
import addObservation from "@/app/services/rosiers/observations/addObservation";
import { useRouter, useSearchParams } from "next/navigation";
import updateObservation from "@/app/services/rosiers/observations/updateObservation";
import ErrorInputForm from "../../shared/ErrorInputForm";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import { OptionType } from "@/app/models/types/OptionType";

type ObserveRosierFormProps = {
  rosierID: string | null;
  lastObservation: Observation | null;
  lastObservationDate: string | null;
  editableDelayPassed: string | boolean | null;
  handleUserHasTypedInTheInput: (targetValue?: string | number | null) => void;
};

const ObserveRosierForm = ({
  rosierID,
  lastObservation,
  lastObservationDate,
  editableDelayPassed,
  handleUserHasTypedInTheInput,
}: ObserveRosierFormProps) => {
  const router = useRouter();
  const { data: sessions } = useSession();

  const searchParams = useSearchParams();
  const plotID = searchParams.get("plotID");
  const plotName = searchParams.get("plotName");

  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
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
    setLoadingOnSubmit(true);
    setInputErrors(null);
    const error: { [key: string]: string } = {};
    const txtIntegerBetween0And999 =
      "Le nombre de feuilles touchées doit être compris entre 0 et 999";
    const txtFeuilleToucheesDepasseFeuillesTotal =
      "Le nombre de feuilles touchées ne peut pas dépasser le nombre de feuilles total";

    // ID user
    if (!sessions) {
      error.userID = "L'identifiant de l'utilisateur n'est pas valide";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        userID: error.userID,
      }));
    }

    // ID rosier
    if (!rosierID) {
      error.rosierID = "L'identifiant du rosier n'est pas valide";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        rosierID: error.rosierID,
      }));
    }

    // Verif des champs du nombre entier
    // nbTotalFeuilles
    if (nbTotalFeuilles.toString().length === 0) {
      error.nbTotalFeuilles = "Veuillez renseigner le nombre total de feuilles";

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbTotalFeuilles: error.nbTotalFeuilles,
      }));
    }
    if (!isIntegerBetween0And999(nbTotalFeuilles)) {
      error.nbTotalFeuilles =
        "Le nombre total de feuilles doit être compris entre 0 et 999";

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbTotalFeuilles: error.nbTotalFeuilles,
      }));
    }

    // nbFeuilleToucheesParLaRouille
    if (!isIntegerBetween0And999(nbFeuilleToucheesParLaRouille)) {
      error.nbFeuilleToucheesParLaRouille = txtIntegerBetween0And999;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParLaRouille: error.nbFeuilleToucheesParLaRouille,
      }));
    }
    // intensiteAttaqueDeLaRouille
    if (
      (intensiteAttaqueDeLaRouille.toString().length > 0 &&
        +intensiteAttaqueDeLaRouille < 0) ||
      (intensiteAttaqueDeLaRouille.toString().length > 0 &&
        +intensiteAttaqueDeLaRouille > 100)
    ) {
      error.intensiteAttaqueDeLaRouille =
        "L'intensité doit être comprise entre 0 et 100";

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        intensiteAttaqueDeLaRouille: error.intensiteAttaqueDeLaRouille,
      }));
    }

    // nbFeuilleToucheesParEcidies
    if (!isIntegerBetween0And999(nbFeuilleToucheesParEcidies)) {
      error.nbFeuilleToucheesParEcidies = txtIntegerBetween0And999;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParEcidies: error.nbFeuilleToucheesParEcidies,
      }));
    }

    // nbFeuilleToucheesParUredos
    if (!isIntegerBetween0And999(nbFeuilleToucheesParUredos)) {
      error.nbFeuilleToucheesParUredos = txtIntegerBetween0And999;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParUredos: error.nbFeuilleToucheesParUredos,
      }));
    }

    // nbFeuilleToucheesParTeleutos
    if (!isIntegerBetween0And999(nbFeuilleToucheesParTeleutos)) {
      error.nbFeuilleToucheesParTeleutos = txtIntegerBetween0And999;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParTeleutos: error.nbFeuilleToucheesParTeleutos,
      }));
    }

    // nbFeuilleToucheesParMarsonia
    if (!isIntegerBetween0And999(nbFeuilleToucheesParMarsonia)) {
      error.nbFeuilleToucheesParMarsonia = txtIntegerBetween0And999;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParMarsonia: error.nbFeuilleToucheesParMarsonia,
      }));
    }

    // nbFeuilleToucheesPar... > nbTotalFeuilles
    if (+nbFeuilleToucheesParLaRouille > +nbTotalFeuilles) {
      error.nbFeuilleToucheesParLaRouille =
        txtFeuilleToucheesDepasseFeuillesTotal;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParLaRouille: error.nbFeuilleToucheesParLaRouille,
      }));
    }

    if (+nbFeuilleToucheesParEcidies > +nbTotalFeuilles) {
      error.nbFeuilleToucheesParEcidies =
        txtFeuilleToucheesDepasseFeuillesTotal;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParEcidies: error.nbFeuilleToucheesParEcidies,
      }));
    }

    if (+nbFeuilleToucheesParUredos > +nbTotalFeuilles) {
      error.nbFeuilleToucheesParUredos = txtFeuilleToucheesDepasseFeuillesTotal;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParUredos: error.nbFeuilleToucheesParUredos,
      }));
    }

    if (+nbFeuilleToucheesParTeleutos > +nbTotalFeuilles) {
      error.nbFeuilleToucheesParTeleutos =
        txtFeuilleToucheesDepasseFeuillesTotal;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParTeleutos: error.nbFeuilleToucheesParTeleutos,
      }));
    }

    if (+nbFeuilleToucheesParMarsonia > +nbTotalFeuilles) {
      error.nbFeuilleToucheesParMarsonia =
        txtFeuilleToucheesDepasseFeuillesTotal;

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        nbFeuilleToucheesParMarsonia: error.nbFeuilleToucheesParMarsonia,
      }));
    }

    // Commentaire
    if (comment && comment.length > 500) {
      error.comment = "Le commentaire ne peut pas dépasser 500 caractères";

      setLoadingOnSubmit(false);
      setInputErrors(o => ({
        ...o,
        comment: error.comment,
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

    // Si observation date de l'année précedent,
    // on remplit ses anciens ou nouvelles valeurs si besoins
    if (
      lastObservation &&
      isPrecedentYearObservationOrObservationDelayPassed(lastObservation)
    ) {
      console.log(
        "isPrecedentYearObservationOrObservationDelayPassed :",
        isPrecedentYearObservationOrObservationDelayPassed(lastObservation)
      );

      observation.timestamp = new Date();
      observation.data = {
        stade_pheno:
          stadePheno && stadePheno.value
            ? stadePheno.value
            : lastObservation.data.stade_pheno,
        nb_feuilles: nbTotalFeuilles
          ? +nbTotalFeuilles
          : lastObservation.data.nb_feuilles,
      };
      observation.commentaire =
        comment.length > 0 ? comment : lastObservation.commentaire;

      // rouille
      if (lastObservation.data.rouille) {
        observation.data = {
          ...observation.data,
          rouille: observation.data.rouille
            ? observation.data.rouille
            : lastObservation.data.rouille,
        };
      }

      // ecidies
      if (lastObservation.data.ecidies) {
        observation.data = {
          ...observation.data,
          ecidies: observation.data.ecidies
            ? observation.data.ecidies
            : lastObservation.data.ecidies,
        };
      }

      // uredos
      if (lastObservation.data.uredos) {
        observation.data = {
          ...observation.data,
          ecidies: observation.data.uredos
            ? observation.data.uredos
            : lastObservation.data.uredos,
        };
      }

      // teleutos
      if (lastObservation.data.teleutos) {
        observation.data = {
          ...observation.data,
          ecidies: observation.data.teleutos
            ? observation.data.teleutos
            : lastObservation.data.teleutos,
        };
      }

      // marsonia
      if (lastObservation.data.marsonia) {
        observation.data = {
          ...observation.data,
          ecidies: observation.data.marsonia
            ? observation.data.marsonia
            : lastObservation.data.marsonia,
        };
      }
    }

    // Add sup properties & compute to observation obj
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
        int: +parseFloat(intensiteAttaqueDeLaRouille.toString()).toFixed(2),
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

    // Error ? return : process
    if (error && Object.keys(error).length > 0) {
      console.log("Error :", error);
      setLoadingOnSubmit(false);
      return;
    }

    // Process to DB
    // CREAT
    if (
      editableDelayPassed == null ||
      (editableDelayPassed != null && editableDelayPassed == true)
    ) {
      console.log("editableDelayPassed :", editableDelayPassed);
      console.log("CREAT");
      // console.log(observation);

      const response = await addObservation(observation);
      setLoadingOnSubmit(false);
      toastSuccess("Observation enregistrée", "create-success");

      if (response && response.status === 200) {
        router.push(
          `/observations/plots/plot?plotID=${plotID}&plotName=${plotName}`
        );
      }
    }

    // UPDATE
    if (editableDelayPassed != null && editableDelayPassed == false) {
      console.log("editableDelayPassed :", editableDelayPassed);

      if (lastObservation && lastObservation.id) {
        console.log("UPDATE");
        // console.log(observation);

        const response = await updateObservation(
          observation,
          +lastObservation.id
        );
        setLoadingOnSubmit(false);
        toastSuccess("Observation éditée", "update-success");

        if (response && response.status === 200) {
          router.push(
            `/observations/plots/plot?plotID=${plotID}&plotName=${plotName}`
          );
        }
      }
    }
  };

  // Errors display
  useEffect(() => {
    if (inputErrors) {
      // Show only 1 error message
      toastError(
        "Veuillez revoir les champs indiqués pour continuer",
        "error-inputs"
      );

      // Show each error message
      // for (const inputError in inputErrors) {
      //   toastError(inputErrors[inputError], `error-${inputError}`);
      // }
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
              setSelectedOption={option => {
                setStadePheno(option);
                handleUserHasTypedInTheInput(option?.value);
              }}
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
                onChange={e => {
                  setNbTotalFeuilles(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
                min="0"
                max="999"
              />
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="nbTotalFeuilles"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
              nb_value={lastObservation?.data.nb_feuilles}
            />
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
                onChange={e => {
                  setNbFeuilleToucheesParLaRouille(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
                min="0"
              />
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="nbFeuilleToucheesParLaRouille"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
              nb_value={lastObservation?.data.rouille?.nb}
            />
          </div>

          {/* Intensité d'attaque de la rouille */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Intensité d&apos;attaque de la rouille</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={intensiteAttaqueDeLaRouille}
                onChange={e => {
                  setIntensiteAttaqueDeLaRouille(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
                min="0"
                step="0.01"
              />
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="intensiteAttaqueDeLaRouille"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
              nb_value={lastObservation?.data.rouille?.int}
            />
          </div>

          {/* Nombre de feuilles touchées par écidies */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par écidies</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParEcidies}
                onChange={e => {
                  setNbFeuilleToucheesParEcidies(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
                min="0"
              />
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="nbFeuilleToucheesParEcidies"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
              nb_value={lastObservation?.data.ecidies?.nb}
            />
          </div>

          {/* Nombre de feuilles touchées par urédos */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Nombre de feuilles touchées par urédos</p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-9 p-2">
              <input
                type="number"
                className="grow"
                value={nbFeuilleToucheesParUredos}
                onChange={e => {
                  setNbFeuilleToucheesParUredos(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
                min="0"
              />
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="nbFeuilleToucheesParUredos"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
              nb_value={lastObservation?.data.uredos?.nb}
            />
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
                onChange={e => {
                  setNbFeuilleToucheesParTeleutos(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
                min="0"
              />
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="nbFeuilleToucheesParTeleutos"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
              nb_value={lastObservation?.data.teleutos?.nb}
            />
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
                onChange={e => {
                  setNbFeuilleToucheesParMarsonia(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
                min="0"
              />
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="nbFeuilleToucheesParMarsonia"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
              nb_value={lastObservation?.data.marsonia?.nb}
            />
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <p className="font-bold">Commentaire</p>
            <label className="form-control h-20 mb-0">
              <textarea
                className="textarea w-full textarea-primary border-txton2 focus-within:border-2"
                value={comment}
                onChange={e => {
                  setComment(e.target.value);
                  handleUserHasTypedInTheInput(e.target.value);
                }}
              ></textarea>
            </label>

            {/* Error */}
            <ErrorInputForm
              inputErrors={inputErrors}
              property="comment"
              editableDelayPassed={editableDelayPassed}
              lastObservation={lastObservation}
              lastObservationDate={lastObservationDate}
            />
          </div>

          <button
            className={`btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md`}
          >
            {loadingOnSubmit ? (
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

const isPrecedentYearObservationOrObservationDelayPassed = (
  observation: Observation | null
) => {
  // Current date
  const currDate = new Date();
  const currDD = currDate.getDate();
  const currMM = currDate.getMonth() + 1;
  const currYY = currDate.getFullYear();

  // Obs date
  const obsDate = new Date(observation?.timestamp as Date);
  const obsDD = obsDate.getDate();
  const obsMM = obsDate.getMonth() + 1;
  const obsYY = obsDate.getFullYear();

  return (
    (obsYY && currYY > +obsYY) ||
    (obsMM === currMM && obsYY === currYY && currDD - +obsDD > 3)
  );
};
