"use client";

import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import PageWrapper from "@/app/components/shared/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";

const AddPlotPageClient = () => {
  const router = useRouter();
  const { selectedExploitationOption } = useContext(ExploitationContext);

  const [loading, setLoading] = useState(false);
  const [plotName, setPlotName] = useState("");
  const [buttonChoice, setButtonChoice] = useState("");
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);
    setLoading(true);

    // Validation
    if (!plotName) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Veuillez écrire un nom pour cette parcelle",
      }));
    }

    if (plotName.length > 40) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Le nom ne peut pas dépasser 40 caractères",
      }));
    }

    if (
      ([] as Parcelle[]).some(
        p => p.nom.toLowerCase() === plotName.toLowerCase()
      )
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Une autre parcelle porte le même nom",
      }));
    }

    // Max plots
    const maxPlotsInExploitation = ([] as Parcelle[]).filter(
      p => p.id_exploitation === selectedExploitationOption?.id
    );
    // console.log("maxPlotsInExploitation :", maxPlotsInExploitation);

    if (maxPlotsInExploitation.length >= 100) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Vous avez atteint la limite de 100 parcelles",
      }));
    }

    // @todo : Process to DB stuffs

    // Reset state & confirm msg
    setLoading(false);

    // Redirect
    if (buttonChoice === "BACK_TO_LIST") {
      toastSuccess(`Parcelle ${plotName} créée`, "create-success-back");
      router.push("/observations");
    } else {
      toastSuccess(`Parcelle ${plotName} créée`, "create-success-another");
      router.push("/observations/plots/addPlot");
    }
  };

  // Errors input
  useEffect(() => {
    if (inputErrors) {
      toastError(inputErrors.nom, "error-nom");
    }
  }, [inputErrors]);

  const emptyData =
    plotName && Array.isArray([plotName]) && [plotName].length > 0
      ? false
      : true;

  return (
    <PageWrapper
      pageTitle="Rospot | Créer une parcelle"
      navBarTitle="Créer une parcelle"
      back={true}
      emptyData={emptyData}
    >
      <div className="container mx-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <p className="mb-2 font-bold">
              Nom <span className="text-error">*</span>
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-background rounded-md mb-5 h-10 p-2">
              <input
                type="text"
                className="grow"
                value={plotName}
                onChange={e => setPlotName(e.target.value)}
              />
            </label>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md"
                onClick={() => {
                  setButtonChoice("BACK_TO_LIST");
                }}
              >
                {loading ? (
                  <span className="loading loading-spinner text-txton3"></span>
                ) : (
                  "Valider et revenir à la liste"
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
                  " Valider et créer une autre parcelle"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddPlotPageClient;
