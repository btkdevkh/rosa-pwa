"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Rosier } from "@/app/models/interfaces/Rosier";
import PageWrapper from "@/app/components/shared/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import SingleSelect, {
  OptionType,
} from "@/app/components/selects/SingleSelect";
import {
  RosierHauteur,
  RosierPosition,
} from "@/app/models/enums/RosierInfosEnum";
import updateRosier from "@/app/services/rosiers/updateRosier";

type UpdateRosierPageClientProps = {
  rosierData: Rosier[];
};

const UpdateRosierPageClient = ({
  rosierData,
}: UpdateRosierPageClientProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const rosierParamID = searchParams.get("rosierID");
  const rosierParamName = searchParams.get("rosierName");
  const plotParamID = searchParams.get("plotID");
  const plotParamName = searchParams.get("plotName");

  // Rosier infos to update
  const rosier = rosierData.find(
    rosier => rosierParamID && rosier.id === +rosierParamID
  );

  const positionRosier = positions.find(p => p.value === rosier?.position);
  const hauteurRosier = hauteurs.find(h => h.value === rosier?.hauteur);

  const [loading, setLoading] = useState(false);
  const [isClearable, setIsClearable] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);
  const [rosierName, setRosierName] = useState(rosierParamName ?? "");
  const [selectedOptionHauteur, setSelectedOptionHauteur] =
    useState<OptionType | null>(hauteurRosier ?? null);
  const [selectedOptionPosition, setSelectedOptionPosition] =
    useState<OptionType | null>(positionRosier ?? null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);
    setLoading(true);

    // Validation
    if (!rosierName) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Veuillez écrire un nom pour ce rosier",
      }));
    }

    if (rosierName.length > 40) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Le nom ne peut pas dépasser 40 caractères",
      }));
    }

    if (
      rosierName &&
      rosierName !== rosierParamName &&
      rosierData.some(
        r =>
          plotParamID &&
          r.id_parcelle === +plotParamID &&
          r.nom.toLowerCase() === rosierName.toLowerCase()
      )
    ) {
      setLoading(false);
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
      nom: rosierName,
      hauteur: selectedOptionHauteur?.value ?? null,
      position: selectedOptionPosition?.value ?? null,
      est_archive: rosier.est_archive,
      id_parcelle: rosier.id_parcelle,
    };

    // Process to DB
    const response = await updateRosier(rosierToUpd);
    resetState();
    setLoading(false);

    if (response && response.status === 200) {
      // Redirect
      toastSuccess(`Rosier ${rosierName} édité`, "update-rosier-success");
      router.push(
        `/observations/plots/rosiers/rosier?rosierID=${rosierParamID}&rosierName=${rosierToUpd.nom}&plotID=${plotParamID}&plotName=${plotParamName}`
      );
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
    rosierName &&
    rosierName !== rosierParamName &&
    rosierName &&
    Array.isArray([rosierName]) &&
    [rosierName].length > 0
      ? false
      : true;

  return (
    <PageWrapper
      pageTitle="Rospot | Éditer le rosier"
      navBarTitle="Éditer le rosier"
      back={true}
      emptyData={emptyData}
    >
      <div className="container mx-auto">
        <h2>Rosier de {plotParamName ?? "n/a"}</h2>
        <br />

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <div className="mb-5">
              <p className="mb-1 font-bold text-sm">
                Nom <span className="text-error">*</span>
              </p>
              <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md h-10 p-2">
                <input
                  type="text"
                  className="grow"
                  value={rosierName}
                  onChange={e => setRosierName(e.target.value)}
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-bold text-sm">Hauteur</label>
              <SingleSelect
                data={hauteurs}
                isClearable={isClearable}
                selectedOption={selectedOptionHauteur}
                setSelectedOption={setSelectedOptionHauteur}
                setIsClearable={setIsClearable}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-bold text-sm">Position</label>
              <SingleSelect
                data={positions}
                isClearable={isClearable}
                selectedOption={selectedOptionPosition}
                setSelectedOption={setSelectedOptionPosition}
                setIsClearable={setIsClearable}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md">
                {loading ? (
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

export default UpdateRosierPageClient;

const hauteurs: OptionType[] = [
  { id: 1, value: RosierHauteur.LOW, label: "Bas" },
  { id: 2, value: RosierHauteur.HIGH, label: "Haut" },
];
const positions: OptionType[] = [
  { id: 1, value: RosierPosition.INTERIOR, label: "Intérieur" },
  { id: 2, value: RosierPosition.OUTSIDE, label: "Extérieur" },
];
