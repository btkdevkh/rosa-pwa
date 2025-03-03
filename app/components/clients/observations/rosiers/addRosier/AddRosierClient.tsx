"use client";

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Rosier } from "@/app/models/interfaces/Rosier";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import SingleSelect from "@/app/components/selects/SingleSelect";
import {
  RosierHauteur,
  RosierPosition,
} from "@/app/models/enums/RosierInfosEnum";
import addRosier from "@/app/services/rosiers/addRosier";
import { OptionType } from "@/app/models/types/OptionType";
import useGetRosiers from "@/app/hooks/rosiers/useGetRosiers";
import Loading from "@/app/components/shared/loaders/Loading";
import useCustomPlotSearchParams from "@/app/hooks/useCustomPlotSearchParams";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";

const AddRosierClient = () => {
  const router = useRouter();
  const { plotID, plotName } = useCustomPlotSearchParams();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { loading, rosiers: rosierData } = useGetRosiers(plotID);

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;

  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [rosierName, setRosierName] = useState("");
  const [buttonChoice, setButtonChoice] = useState("");
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);
  const [selectedOptionHauteur, setSelectedOptionHauteur] =
    useState<OptionType | null>(null);
  const [selectedOptionPosition, setSelectedOptionPosition] =
    useState<OptionType | null>(null);
  const [isClearable, setIsClearable] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);
    setLoadingOnSubmit(true);

    // Validation
    if (!rosierName) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Veuillez écrire un nom pour ce rosier",
      }));
    }

    if (rosierName.length > 40) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Le nom ne peut pas dépasser 40 caractères",
      }));
    }

    if (
      rosierData?.some(
        r =>
          plotID &&
          r.id_parcelle === +plotID &&
          r.nom.toLowerCase() === rosierName.toLowerCase()
      )
    ) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Un autre rosier de cette parcelle porte le même nom",
      }));
    }

    // Max rosiers
    const rosiersInParcelle = rosierData?.map(
      r => plotID && r.id_parcelle === +plotID
    );

    if (rosiersInParcelle && rosiersInParcelle.length >= 100) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Vous avez atteint la limite de 100 rosiers pour cette parcelle",
      }));
    }

    if (plotID) {
      const rosier: Rosier = {
        nom: rosierName,
        hauteur: selectedOptionHauteur?.value ?? null,
        position: selectedOptionPosition?.value ?? null,
        est_archive: false,
        id_parcelle: +plotID,
      };

      // Process to DB
      const response = await addRosier(rosier);

      // Reset state & confirm msg
      setLoadingOnSubmit(false);
      resetState();

      if (response && response.status === 200) {
        // Redirect
        if (buttonChoice === "BACK_TO_PLOT") {
          toastSuccess(`Rosier ${rosierName} crée`, "create-success-back");
          router.push(
            `${MenuUrlPath.OBSERVATIONS}/plots/plot?${explQueries}&plotID=${plotID}&plotName=${plotName}`
          );
        } else {
          toastSuccess(`Rosier ${rosierName} crée`, "create-success-another");
          router.push(
            `${MenuUrlPath.OBSERVATIONS}/plots/rosiers/addRosier?${explQueries}&plotID=${plotID}&plotName=${plotName}`
          );
        }
      }
    }
  };

  // Reset state
  const resetState = () => {
    setRosierName("");
    setSelectedOptionHauteur(null);
    setSelectedOptionPosition(null);
  };

  // Errors input
  useEffect(() => {
    if (inputErrors) {
      toastError(inputErrors.nom, "error-nom");
    }
  }, [inputErrors]);

  const emptyData =
    rosierName && Array.isArray([rosierName]) && [rosierName].length > 0
      ? false
      : true;

  const pathUrl = `${MenuUrlPath.OBSERVATIONS}/plots/plot?${explQueries}&plotID=${plotID}&plotName=${plotName}`;

  return (
    <PageWrapper
      pageTitle="Rospot | Créer un rosier"
      navBarTitle="Créer un rosier"
      back={true}
      emptyData={emptyData}
      pathUrl={pathUrl}
    >
      <div className="container mx-auto">
        {/* Loading */}
        {loading && <Loading />}

        <h2>Ce rosier sera crée dans {plotName ?? "n/a"}</h2>
        <br />

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <div className="mb-5">
              <p className="mb-1 font-bold text-sm">
                Nom <span className="text-error">*</span>
              </p>
              <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-10 p-2">
                <input
                  type="text"
                  className="grow"
                  value={rosierName}
                  onChange={e => setRosierName(e.target.value)}
                />
              </label>

              {/* Error */}
              {inputErrors && inputErrors.nom && (
                <p className="text-error">{inputErrors.nom}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-bold text-sm">Hauteur</label>
              <SingleSelect
                data={hauteurs}
                isClearable={isClearable}
                selectedOption={selectedOptionHauteur}
                setSelectedOption={
                  setSelectedOptionHauteur as Dispatch<
                    SetStateAction<
                      | OptionType
                      | OptionTypeIndicator
                      | OptionTypeDashboard
                      | null
                    >
                  >
                }
                setIsClearable={setIsClearable}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-bold text-sm">Position</label>
              <SingleSelect
                data={positions}
                isClearable={isClearable}
                selectedOption={selectedOptionPosition}
                setSelectedOption={
                  setSelectedOptionPosition as Dispatch<
                    SetStateAction<
                      | OptionType
                      | OptionTypeIndicator
                      | OptionTypeDashboard
                      | null
                    >
                  >
                }
                setIsClearable={setIsClearable}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md"
                onClick={() => {
                  setButtonChoice("BACK_TO_PLOT");
                }}
              >
                {loadingOnSubmit ? (
                  <span className="loading loading-spinner text-txton3"></span>
                ) : (
                  "Valider et revenir à la parcelle"
                )}
              </button>

              <button
                className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md"
                onClick={() => {
                  setButtonChoice("CREATE_ANOTHER_ONE");
                }}
              >
                {loadingOnSubmit ? (
                  <span className="loading loading-spinner text-txton3"></span>
                ) : (
                  " Valider et créer un autre rosier"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddRosierClient;

const hauteurs: OptionType[] = [
  { id: 1, value: RosierHauteur.LOW, label: "Bas" },
  { id: 2, value: RosierHauteur.HIGH, label: "Haut" },
];
const positions: OptionType[] = [
  { id: 1, value: RosierPosition.INTERIOR, label: "Intérieur" },
  { id: 2, value: RosierPosition.OUTSIDE, label: "Extérieur" },
];
