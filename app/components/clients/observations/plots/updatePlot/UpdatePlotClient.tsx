"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import useGetPlots from "@/app/hooks/plots/useGetPlots";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import updatePlot from "@/app/services/plots/updatePlot";
import Loading from "@/app/components/shared/loaders/Loading";
import useCustomPlotSearchParams from "@/app/hooks/useCustomPlotSearchParams";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";

const UpdatePlotClient = () => {
  const router = useRouter();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { plotID, plotName, plotArchived } = useCustomPlotSearchParams();

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;

  const { loading, plots: plotData } = useGetPlots(explID, true);

  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [parcelleName, setParcelleName] = useState(plotName ?? "");
  const [inputErrors, setInputErrors] = useState<{ nom: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputErrors(null);
    setLoadingOnSubmit(true);

    // Validation
    if (!parcelleName) {
      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        nom: "Veuillez écrire un nom pour cette parcelle",
      }));
    }

    if (parcelleName.length > 40) {
      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        nom: "Le nom ne peut pas dépasser 40 caractères",
      }));
    }

    if (
      parcelleName &&
      parcelleName !== plotName &&
      plotData &&
      plotData.length > 0 &&
      plotData.some((p) => p.nom.toLowerCase() === parcelleName.toLowerCase())
    ) {
      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        nom: "Une autre parcelle porte le même nom",
      }));
    }

    if (!explID) {
      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        nom: "Veuillez selectionner une exploitation dans le menu Paramètres",
      }));
    }

    if (!plotID) {
      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        nom: "L'identifiant de la parcelle manquante",
      }));
    }

    const plotToUpdate: Parcelle = {
      id: +plotID,
      nom: parcelleName,
      id_exploitation: +explID,
    };

    // Update to DB
    const response = await updatePlot(plotToUpdate);

    // Reset state & confirm msg
    setParcelleName("");
    setLoadingOnSubmit(false);

    if (response && response.status === 200) {
      // Redirect
      toastSuccess(`Parcelle ${parcelleName} éditée`, "update-success");
      router.push(
        `${MenuUrlPath.OBSERVATIONS}/plots/plot?${explQueries}&plotID=${plotID}&plotName=${parcelleName}&archived=${plotArchived}`
      );
    }
  };

  // Errors input
  useEffect(() => {
    if (inputErrors) {
      toastError(inputErrors.nom, "error-nom");
    }
  }, [inputErrors]);

  const emptyData =
    plotName &&
    parcelleName &&
    parcelleName.length > 0 &&
    parcelleName !== plotName
      ? false
      : true;

  const pathUrl = `${MenuUrlPath.OBSERVATIONS}/plots/plot?${explQueries}&plotID=${plotID}&plotName=${plotName}&archived=${plotArchived}`;

  return (
    <PageWrapper
      pageTitle="Rosa | Éditer la parcelle"
      navBarTitle="Éditer la parcelle"
      back={true}
      emptyData={emptyData}
      pathUrl={pathUrl}
    >
      <div className="container mx-auto">
        {/* Loading */}
        {loading && <Loading />}

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full mx-auto">
            <p className="mb-2 font-bold">
              Nom <span className="text-error">*</span>
            </p>
            <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-10 p-2">
              <input
                type="text"
                className="grow"
                value={parcelleName}
                onChange={(e) => setParcelleName(e.target.value)}
              />

              {plotName && (
                <button onClick={() => setParcelleName("")}>
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

export default UpdatePlotClient;
