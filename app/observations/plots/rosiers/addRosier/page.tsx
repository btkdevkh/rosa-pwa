"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";

const AddRosierPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plotParamName = searchParams.get("plotName");
  // const plotParamUID = searchParams.get("plotUID");
  // const { selectedExploitationOption } = useContext(ExploitationContext);

  const [loading, setLoading] = useState(false);
  const [rosierName, setRosierName] = useState("");
  const [buttonChoice, setButtonChoice] = useState("");
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);

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

    // @todo : Process to DB stuffs

    // Reset state & confirm msg
    setLoading(false);

    // Redirect
    if (buttonChoice === "BACK_TO_LIST") {
      toastSuccess(`Rosier ${rosierName} crée`, "create-success-back");
      router.push("/observations/plots/rosiers");
    } else {
      toastSuccess(`Rosier ${rosierName} crée`, "create-success-another");
      router.push("/observations/plots/rosiers/addRosier");
    }
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
        <h2>Ce rosier sera crée dans {plotParamName}</h2>
        <br />

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <p className="mb-2 font-bold">
              Nom <span className="text-error">*</span>
            </p>
            <label className="input input-primary border-txton2 flex items-center gap-2 bg-background rounded-md mb-5 h-10 p-2">
              <input
                type="text"
                className="grow"
                value={rosierName}
                onChange={e => setRosierName(e.target.value)}
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

export default AddRosierPage;
