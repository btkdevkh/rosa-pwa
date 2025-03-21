"use client";

import * as XLSX from "xlsx";
import { fr } from "date-fns/locale/fr";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import DatePicker, { registerLocale } from "react-datepicker";
import { useEffect, useState } from "react";
import DateIcon from "@/app/components/shared/icons/DateIcon";
import "react-datepicker/dist/react-datepicker.css";
import XSmallIcon from "@/app/components/shared/icons/XSmallIcon";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";
import toastError from "@/app/helpers/notifications/toastError";
import { DownloadObsDataEnum } from "@/app/models/enums/DownloadObsDataEnum";
import Loading from "@/app/components/shared/loaders/Loading";
import useSimulateLoading from "@/app/hooks/useSimulateLoading";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import getObservationsByPeriodDownload from "@/app/actions/observations/getObservationsByPeriodDownload";

registerLocale("fr", fr);

const DownloadDataClient = () => {
  const { loading } = useSimulateLoading();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();

  // Dates
  const year = new Date().getFullYear();
  const defaultStartDate = new Date(`${year}-01-01`);
  const defaultEndDate = new Date(`${year}-12-31`);
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);

  const [downloadArchivedData, setDownloadArchivedData] =
    useState<boolean>(true);
  const [openDate, setOpenDate] = useState<boolean>(false);

  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [inputErrors, setInputErrors] = useState<{
    [key: string]: string;
  } | null>(null);

  // Handle change date
  const handleChangeDate = ([newStartDate, newEndDate]: [
    Date | null,
    Date | null
  ]) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const errors: { [key: string]: string } = {};

    if (!startDate || !endDate) {
      errors.dateRange = "Veuillez sélectionner une période valide";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        dateRange: errors.dateRange,
      }));
    }

    // Set loading
    setLoadingOnSubmit(true);

    // Download data
    try {
      if (!explID) {
        setLoadingOnSubmit(false);
        return setInputErrors(o => ({
          ...o,
          explID: "Identifiant de l'explorateur introuvable",
        }));
      }

      // Get observation data
      const response = await getObservationsByPeriodDownload(
        +explID,
        [startDate, endDate],
        downloadArchivedData
      );
      console.log("Response", response);

      if (response && response.success) {
        if (
          !response.observations ||
          (response.observations && response.observations.length === 0)
        ) {
          setLoadingOnSubmit(false);
          return toastError(
            "Aucune observation trouvée pour cette période",
            "error-inputs"
          );
        }

        // Format observations
        const formatObservations = response.observations.map(observation => {
          if (observation) {
            if (observation.timestamp) {
              // Date observation "JJ/MM"
              const obsDate = observation.timestamp
                ? new Date(observation.timestamp).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                : "";

              // Format download data
              const downloadObsData = {
                parcelle: observation.plotName,
                rosier: observation.rosierName,
                hauteur: observation.hauteur,
                position: observation.position,
                date: obsDate,
                stade_pheno: observation.data.stade_pheno || "",
                nb_total_feuilles: observation.data.nb_feuilles || "",
                nb_feuilles_rouille: observation.data.rouille?.nb || "",
                freq_rouille: observation.data.rouille?.freq || "",
                int_rouille: observation.data.rouille?.int || "",
                nb_feuilles_ecidies: observation.data.ecidies?.nb || "",
                freq_ecidies: observation.data.ecidies?.freq || "",
                nb_feuilles_uredos: observation.data.uredos?.nb || "",
                freq_uredos: observation.data.uredos?.freq || "",
                nb_feuilles_teleutos: observation.data.teleutos?.nb || "",
                freq_teleutos: observation.data.teleutos?.freq || "",
                nb_feuilles_marsonia: observation.data.marsonia?.nb || "",
                freq_marsonia: observation.data.marsonia?.freq || "",
                commentaire: observation.commentaire || "",
              };

              return downloadObsData;
            }
          }

          return null;
        });

        // Formate date string "JJ-MM-AAAA"
        const startDateString = startDate.toISOString().split("T")[0];
        const startDateStringFormatted = `${startDateString.split("-")[2]}-${
          startDateString.split("-")[1]
        }-${startDateString.split("-")[0]}`;
        const endDateString = endDate.toISOString().split("T")[0];
        const endDateStringFormatted = `${endDateString.split("-")[2]}-${
          endDateString.split("-")[1]
        }-${endDateString.split("-")[0]}`;

        // Downoaded CSV title
        const downloadCSVTitle = `Observations de ${explName} du ${startDateStringFormatted} au ${endDateStringFormatted}`;

        // Format formatObservations properties with DownloadObsDataEnum
        const formatObservationsKeys = formatObservations.map(obs => {
          if (!obs) return null;

          return Object.entries(DownloadObsDataEnum).reduce(
            (acc, [key, value]) => {
              if (key in obs) {
                acc[value] = obs[key as keyof typeof obs] ?? null;
              }
              return acc;
            },
            {} as Record<string, string | number | null>
          );
        });

        // Create XLSX/CSV
        const json_xlsx = XLSX.utils.json_to_sheet(formatObservationsKeys);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, json_xlsx, "Sheet1");

        // Convert to CSV format with ";" separator and add BOM
        const json_csv =
          "\uFEFF" + XLSX.utils.sheet_to_csv(json_xlsx, { FS: ";" });

        // Download CSV
        downloadCSV(json_csv, downloadCSVTitle);
      }

      // Reset loading
      setLoadingOnSubmit(false);
      setInputErrors(null);
      return toastSuccess(
        "Observations téléchargées avec succès",
        "success-download"
      );
    } catch (error) {
      console.log("Error downloading data", error);
      setLoadingOnSubmit(false);
    }
  };

  const downloadCSV = (dataCSV: string, downloadCSVTitle: string) => {
    const csv = dataCSV;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${downloadCSVTitle}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Absent exploitation ID error
  useEffect(() => {
    if (inputErrors && "explID" in inputErrors) {
      toastError(inputErrors.explID, "error-inputs");
    }
  }, [inputErrors]);

  // Generic error display
  useEffect(() => {
    if (inputErrors) {
      toastError(
        "Veuillez revoir les champs indiqués pour continuer",
        "error-inputs"
      );
    }
  }, [inputErrors]);

  return (
    <PageWrapper
      pageTitle="Rospot | Télécharger mes données"
      navBarTitle="Télécharger mes données"
      back={true}
      pathUrl={`/settings?explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`}
    >
      <>
        <div className="container mx-auto">
          {/* Loading */}
          {loading && <Loading />}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {/* Date picker */}
                <div
                  className="w-full relative"
                  onClick={() => setOpenDate(true)}
                >
                  <DatePicker
                    locale="fr"
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleChangeDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="JJ/MM/AAAA - JJ/MM/AAAA"
                    selectsRange
                    strictParsing
                    className="custom-react-datepicker"
                    open={openDate}
                    onClickOutside={() => setOpenDate(false)}
                  />

                  {/*  Icons */}
                  <div className="flex gap-3 items-center absolute -bottom-1 right-2">
                    {/* X icon */}
                    <button
                      id="clearDate"
                      type="button"
                      onClick={e => {
                        e.preventDefault();

                        setStartDate(null);
                        setEndDate(null);
                        setInputErrors(null);
                      }}
                    >
                      <XSmallIcon />
                    </button>

                    <span className="divider"></span>

                    {/* Date icon */}
                    <button type="button">
                      <DateIcon />
                    </button>
                  </div>
                </div>

                {/* Error */}
                <ErrorInputForm
                  inputErrors={inputErrors}
                  property="dateRange"
                />
              </div>

              {/* Download archived data checkbox */}
              {/* Supprimer la class "hidden" si l'archivage sera implémenter */}
              <div className="hidden">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="downloadArchivedData"
                    checked={downloadArchivedData}
                    onChange={() =>
                      setDownloadArchivedData(!downloadArchivedData)
                    }
                    className="w-4 h-4 rounded-sm checkbox checkbox-primary"
                  />

                  <label htmlFor="downloadArchivedData">
                    Télécharger les données archivées
                  </label>
                </div>
              </div>
            </div>

            <br />

            {/* Submit button */}
            <button
              type="submit"
              className={`btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md`}
            >
              {loadingOnSubmit ? (
                <span className="loading loading-spinner text-txton3"></span>
              ) : (
                "Télécharger"
              )}
            </button>
          </form>
        </div>
      </>
    </PageWrapper>
  );
};

export default DownloadDataClient;
