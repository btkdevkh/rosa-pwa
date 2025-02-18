"use client";

import { FormEvent, useEffect, useState } from "react";
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
import updateRosier from "@/app/services/rosiers/updateRosier";
import { OptionType } from "@/app/models/types/OptionType";
import useGetRosiers from "@/app/hooks/rosiers/useGetRosiers";
import Loading from "@/app/components/shared/loaders/Loading";
import useCustomPlotSearchParams from "@/app/hooks/useCustomPlotSearchParams";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import useCustomRosierSearchParams from "@/app/hooks/useCustomRosierSearchParams";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";

const UpdateRosierClient = () => {
  const router = useRouter();

  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { plotID, plotName, plotArchived } = useCustomPlotSearchParams();
  const { rosierID, rosierName } = useCustomRosierSearchParams();
  const { loading, rosiers: rosierData } = useGetRosiers(plotID);

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;

  // Rosier infos to update
  const rosier = rosierData?.find(
    rosier => rosierID && rosier.id === +rosierID
  );

  const positionRosier = positions.find(p => p.value === rosier?.position);
  const hauteurRosier = hauteurs.find(h => h.value === rosier?.hauteur);

  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [isClearable, setIsClearable] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);
  const [rosierNom, setRosierNom] = useState(rosierName ?? "");
  const [selectedOptionHauteur, setSelectedOptionHauteur] =
    useState<OptionType | null>(hauteurRosier ?? null);
  const [selectedOptionPosition, setSelectedOptionPosition] =
    useState<OptionType | null>(positionRosier ?? null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);
    setLoadingOnSubmit(true);

    // Validation
    if (!rosierNom) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Veuillez écrire un nom pour ce rosier",
      }));
    }

    if (rosierNom.length > 40) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Le nom ne peut pas dépasser 40 caractères",
      }));
    }

    if (
      rosierNom &&
      rosierNom !== rosierName &&
      rosierData?.some(
        r =>
          plotID &&
          r.id_parcelle === +plotID &&
          r.nom.toLowerCase() === rosierNom.toLowerCase()
      )
    ) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Un autre rosier de cette parcelle porte le même nom",
      }));
    }

    if (!rosier) {
      return toastError(`Rosier non trouvé`, "rosier-not-found");
    }

    const rosierToUpd: Rosier = {
      id: rosier.id,
      nom: rosierNom,
      hauteur: selectedOptionHauteur?.value ?? null,
      position: selectedOptionPosition?.value ?? null,
      est_archive: rosier.est_archive,
      id_parcelle: rosier.id_parcelle,
    };

    // Process to DB
    const response = await updateRosier(rosierToUpd);
    resetState();
    setLoadingOnSubmit(false);

    if (response && response.status === 200) {
      // Redirect
      toastSuccess(`Rosier ${rosierNom} édité`, "update-rosier-success");
      router.push(
        `${MenuUrlPath.OBSERVATIONS}/plots/rosiers/rosier?${explQueries}&rosierID=${rosierID}&rosierName=${rosierToUpd.nom}&plotID=${plotID}&plotName=${plotName}&archived=${plotArchived}`
      );
    }
  };

  // Reset state
  const resetState = () => {
    setRosierNom("");
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
    rosierNom && rosierNom !== rosierName && rosierNom && rosierNom.length > 0
      ? false
      : true;

  const pathUrl = `${MenuUrlPath.OBSERVATIONS}/plots/rosiers/rosier?${explQueries}&rosierID=${rosierID}&rosierName=${rosierName}&plotID=${plotID}&plotName=${plotName}&archived=${plotArchived}`;

  return (
    <PageWrapper
      pageTitle="Rospot | Éditer le rosier"
      navBarTitle="Éditer le rosier"
      back={true}
      emptyData={emptyData}
      pathUrl={pathUrl}
    >
      <div className="container mx-auto">
        {/* Loading */}
        {loading && <Loading />}

        <h2>Rosier de {plotName ?? "n/a"}</h2>
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
                  value={rosierNom}
                  onChange={e => setRosierNom(e.target.value)}
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
                isClearable={
                  isClearable || selectedOptionHauteur ? true : false
                }
                selectedOption={selectedOptionHauteur}
                setSelectedOption={setSelectedOptionHauteur}
                setIsClearable={setIsClearable}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-bold text-sm">Position</label>
              <SingleSelect
                data={positions}
                isClearable={
                  isClearable || selectedOptionPosition ? true : false
                }
                selectedOption={selectedOptionPosition}
                setSelectedOption={setSelectedOptionPosition}
                setIsClearable={setIsClearable}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md">
                {loadingOnSubmit ? (
                  <span className="loading loading-spinner text-txton3"></span>
                ) : (
                  "Valider"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default UpdateRosierClient;

const hauteurs: OptionType[] = [
  { id: 1, value: RosierHauteur.LOW, label: "Bas" },
  { id: 2, value: RosierHauteur.HIGH, label: "Haut" },
];
const positions: OptionType[] = [
  { id: 1, value: RosierPosition.INTERIOR, label: "Intérieur" },
  { id: 2, value: RosierPosition.OUTSIDE, label: "Extérieur" },
];
