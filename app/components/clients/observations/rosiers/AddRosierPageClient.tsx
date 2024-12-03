"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import SingleSelect, {
  OptionType,
} from "@/app/components/selects/SingleSelect";
import { v4 as uuidv4 } from "uuid";
import { Rosier } from "@/app/models/interfaces/Rosier";
import { parcelles, rosiersFake } from "@/app/data";

const AddRosierPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plotParamName = searchParams.get("plotName");
  const plotParamUID = searchParams.get("plotUID");
  // const { selectedExploitationOption } = useContext(ExploitationContext);

  const [loading, setLoading] = useState(false);
  const [rosierName, setRosierName] = useState("");
  const [buttonChoice, setButtonChoice] = useState("");
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);
  const [selectedOptionHauteur, setSelectedOptionHauteur] =
    useState<OptionType | null>(null);
  const [selectedOptionPosition, setSelectedOptionPosition] =
    useState<OptionType | null>(null);

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
      parcelles.some(
        p => p.map_rosier?.nom.toLowerCase() === rosierName.toLowerCase()
      )
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Un autre rosier de cette parcelle porte le même nom",
      }));
    }

    // Max rosiers
    const rosiersInParcelle = parcelles.map(p => p.map_rosier);

    if (rosiersInParcelle.length >= 100) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Vous avez atteint la limite de 100 rosiers pour cette parcelle",
      }));
    }

    const rosier: Rosier = {
      uid: uuidv4(),
      nom: rosierName,
      hauteur: selectedOptionHauteur?.value,
      position: selectedOptionPosition?.value,
      editionDelay: false,
      archived: false,
      map_zone:
        plotParamName && plotParamUID
          ? {
              uid: plotParamUID,
              nom: plotParamName,
            }
          : null,
    };
    console.log("rosier :", rosier);

    // @todo : Process to DB stuffs
    rosiersFake.push(rosier);

    // Reset state & confirm msg
    setLoading(false);
    resetState();

    // Redirect
    if (buttonChoice === "BACK_TO_PLOT") {
      toastSuccess(`Rosier ${rosierName} crée`, "create-success-back");
      router.push(
        `/observations/plots/${plotParamUID}?uid=${plotParamUID}&nom=${plotParamName}`
      );
    } else {
      toastSuccess(`Rosier ${rosierName} crée`, "create-success-another");
      router.push(
        `/observations/plots/rosiers/addRosier?plotUID=${plotParamUID}&plotName=${plotParamName}`
      );
    }
  };

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

  return (
    <PageWrapper
      pageTitle="Rospot | Créer un rosier"
      navBarTitle="Créer un rosier"
      back={true}
      emptyData={emptyData}
    >
      <div className="container mx-auto">
        <h2>Ce rosier sera crée dans {plotParamName ?? "n/a"}</h2>
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
                selectedOption={selectedOptionHauteur}
                setSelectedOption={setSelectedOptionHauteur}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-bold text-sm">Position</label>
              <SingleSelect
                data={positions}
                selectedOption={selectedOptionPosition}
                setSelectedOption={setSelectedOptionPosition}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md"
                onClick={() => {
                  setButtonChoice("BACK_TO_PLOT");
                }}
              >
                {loading ? (
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
                {loading ? (
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

export default AddRosierPageClient;

const hauteurs: OptionType[] = [
  { uid: "1", value: "down", label: "Bas" },
  { uid: "2", value: "high", label: "Haut" },
];
const positions: OptionType[] = [
  { uid: "1", value: "interior", label: "Intérieur" },
  { uid: "2", value: "outside", label: "Extérieur" },
];
