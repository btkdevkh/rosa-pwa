"use client";

import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import PageWrapper from "@/app/components/shared/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import addPlot from "@/app/services/plots/addPlot";
import usePlots from "@/app/hooks/plots/usePlots";

const AddPlotClient = () => {
  const router = useRouter();

  const { selectedExploitationOption } = useContext(ExploitationContext);
  const { plots: plotData } = usePlots(selectedExploitationOption?.id, true);

  const [loading, setLoading] = useState(false);
  const [plotName, setPlotName] = useState("");
  const [buttonChoice, setButtonChoice] = useState("");
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setInputErrors(null);

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
      plotData &&
      plotData.length > 0 &&
      plotData.some(p => p.nom.toLowerCase() === plotName.toLowerCase())
    ) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Une autre parcelle porte le même nom",
      }));
    }

    // Max plots in exploitation
    if (plotData && plotData.length >= 100) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Vous avez atteint la limite de 100 parcelles",
      }));
    }

    if (!selectedExploitationOption) {
      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        nom: "Veuillez selectionner une exploitation",
      }));
    }

    const newPlot: Parcelle = {
      nom: plotName,
      id_exploitation: selectedExploitationOption.id,
      est_archive: false,
    };

    // Register to DB
    const response = await addPlot(newPlot);

    // Reset state & confirm msg
    setPlotName("");
    setLoading(false);

    if (response && response.status === 200) {
      // Redirect
      if (buttonChoice === "BACK_TO_LIST") {
        toastSuccess(
          `Parcelle ${plotName} créée`,
          `create-success-back-${plotName}`
        );

        router.push("/observations");
      } else if (buttonChoice === "CREATE_ANOTHER_ONE") {
        toastSuccess(
          `Parcelle ${plotName} créée`,
          `create-success-another-${plotName}`
        );

        router.push("/observations/plots/addPlot");
      }
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
      pathUrl={`/observations`}
    >
      <div className="container mx-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <p className="mb-2 font-bold">
              Nom <span className="text-error">*</span>
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-10 p-2">
              <input
                type="text"
                className="grow"
                value={plotName}
                onChange={e => setPlotName(e.target.value)}
              />

              {plotName && (
                <button onClick={() => setPlotName("")}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_247_10210)">
                      <path
                        d="M12.2005 3.80665C11.9405 3.54665 11.5205 3.54665 11.2605 3.80665L8.00047 7.05998L4.74047 3.79998C4.48047 3.53998 4.06047 3.53998 3.80047 3.79998C3.54047 4.05998 3.54047 4.47998 3.80047 4.73998L7.06047 7.99998L3.80047 11.26C3.54047 11.52 3.54047 11.94 3.80047 12.2C4.06047 12.46 4.48047 12.46 4.74047 12.2L8.00047 8.93998L11.2605 12.2C11.5205 12.46 11.9405 12.46 12.2005 12.2C12.4605 11.94 12.4605 11.52 12.2005 11.26L8.94047 7.99998L12.2005 4.73998C12.4538 4.48665 12.4538 4.05998 12.2005 3.80665Z"
                        fill="#2C3E50"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_247_10210">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              )}
            </label>

            {/* Error */}
            {inputErrors && inputErrors.nom && (
              <p className="text-error">{inputErrors.nom}</p>
            )}

            <br />

            <div className="flex flex-col gap-3">
              <button
                type="submit"
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
                type="submit"
                className="btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md"
                onClick={() => {
                  setButtonChoice("CREATE_ANOTHER_ONE");
                }}
              >
                {loading ? (
                  <span className="loading loading-spinner text-txton3"></span>
                ) : (
                  "Valider et créer une autre parcelle"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddPlotClient;
