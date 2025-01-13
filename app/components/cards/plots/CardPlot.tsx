"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import usePlots from "@/app/hooks/plots/usePlots";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { ExploitationContext } from "@/app/context/ExploitationContext";

type CardPlotProps = {
  plot: Parcelle;
};

const CardPlot = ({ plot }: CardPlotProps) => {
  const router = useRouter();

  const { selectedExploitationOption } = use(ExploitationContext);
  const { rosiers: rosierData, observations: observationData } = usePlots(
    selectedExploitationOption?.id
  );

  const rosiersFiltredByPlotID = rosierData?.filter(
    rosier => rosier.id_parcelle === plot.id
  );

  const observationsRosierByPlot = observationData
    ?.map(obs => {
      if (rosiersFiltredByPlotID) {
        for (const rosier of rosiersFiltredByPlotID) {
          if (rosier?.id === obs.id_rosier) {
            return {
              rosier_est_archive: rosier.est_archive,
              id_parcelle: plot.id,
              ...obs,
            };
          }
        }
      }
    })
    .filter(obs => obs != undefined);

  // Current date
  const currDate = new Date();
  const currDD = currDate.getDate();
  const currMM = currDate.getMonth() + 1;
  const currYY = currDate.getFullYear();

  // Si la parcelle comporte au moins un rosier non archivé dont le délai d’édition* est écoulé.
  const plotHasAtLeastOneRosierNonArchivedWithDelayEditionPassed =
    observationsRosierByPlot && observationsRosierByPlot.length > 0
      ? observationsRosierByPlot.some(obs => {
          // Obs date
          const obsDate = new Date(obs.timestamp as Date);
          // console.log("obsDate :", obsDate);
          const obsDD = obsDate.getDate();
          const obsMM = obsDate.getMonth() + 1;
          const obsYY = obsDate.getFullYear();

          return (
            (obs.rosier_est_archive || !obs.rosier_est_archive) &&
            obsMM === currMM &&
            obsYY === currYY &&
            currDD - +obsDD > 3
          );
        })
      : false;

  // Si la parcelle ne comporte aucun rosier non archivé dont le délai d’édition* est écoulé.
  const plotHasNoRosierNonArchivedWithDelayEditionPassed =
    observationsRosierByPlot && observationsRosierByPlot.length > 0
      ? observationsRosierByPlot.every(obs => {
          // Obs date
          const obsDate = new Date(obs.timestamp as Date);
          // console.log("obsDate :", obsDate);
          const obsDD = obsDate.getDate();
          const obsMM = obsDate.getMonth() + 1;
          const obsYY = obsDate.getFullYear();

          return (
            obs.rosier_est_archive == true &&
            obsMM === currMM &&
            obsYY === currYY &&
            currDD - +obsDD > 3
          );
        })
      : false;

  const handleDeArchivePlot = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    console.log("@todo");
  };

  console.log("observationsRosierByPlot :", observationsRosierByPlot);
  console.log(
    "plotHasAtLeastOneRosierNonArchivedWithDelayEditionPassed :",
    plotHasAtLeastOneRosierNonArchivedWithDelayEditionPassed
  );
  console.log(
    "plotHasNoRosierNonArchivedWithDelayEditionPassed :",
    plotHasNoRosierNonArchivedWithDelayEditionPassed
  );

  return (
    <>
      <div
        className="card bg-base-100 w-full shadow-md cursor-pointer"
        onClick={() => {
          router.push(
            `/observations/plots/plot?plotID=${plot.id}&plotName=${plot.nom}&archived=${plot.est_archive}`
          );
        }}
      >
        <div
          className={`flex justify-between items-center ${
            plot.est_archive ? "py-[0.5] px-3" : "p-3"
          }`}
        >
          <div className="flex items-center gap-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_9_4671)">
                <path
                  d="M14.65 4.97999L9.65 3.22999C9.23 3.07999 8.77 3.07999 8.35 3.21999L4.36 4.55999C3.55 4.83999 3 5.59999 3 6.45999V18.31C3 19.72 4.41 20.68 5.72 20.17L8.65 19.03C8.87 18.94 9.12 18.94 9.34 19.02L14.34 20.77C14.76 20.92 15.22 20.92 15.64 20.78L19.63 19.44C20.44 19.17 20.99 18.4 20.99 17.54V5.68999C20.99 4.27999 19.58 3.31999 18.27 3.82999L15.34 4.96999C15.12 5.04999 14.88 5.05999 14.65 4.97999ZM15 18.89L9 16.78V5.10999L15 7.21999V18.89Z"
                  fill="#2C3E50"
                />
              </g>
              <defs>
                <clipPath id="clip0_9_4671">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <div>
              <h2>
                {plot.nom.length > 20
                  ? plot.nom.slice(0, 20) + "..."
                  : plot.nom}
              </h2>

              {plot.est_archive && (
                <span className="text-txton2 text-xs">Archivée</span>
              )}
            </div>
          </div>

          {/* 
            Si la parcelle comporte au moins un rosier non archivé 
            dont le délai d’édition* est écoulé, mettre l’icone “todo” 
          */}
          {!plot.est_archive &&
            !plotHasNoRosierNonArchivedWithDelayEditionPassed &&
            plotHasAtLeastOneRosierNonArchivedWithDelayEditionPassed && (
              // Icon todo
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 15H13L15 13H7C6.71667 13 6.47917 13.0958 6.2875 13.2875C6.09583 13.4792 6 13.7167 6 14C6 14.2833 6.09583 14.5208 6.2875 14.7125C6.47917 14.9042 6.71667 15 7 15ZM7 11H11C11.2833 11 11.5208 10.9042 11.7125 10.7125C11.9042 10.5208 12 10.2833 12 10C12 9.71667 11.9042 9.47917 11.7125 9.2875C11.5208 9.09583 11.2833 9 11 9H7C6.71667 9 6.47917 9.09583 6.2875 9.2875C6.09583 9.47917 6 9.71667 6 10C6 10.2833 6.09583 10.5208 6.2875 10.7125C6.47917 10.9042 6.71667 11 7 11ZM9 19H4C3.45 19 2.97917 18.8042 2.5875 18.4125C2.19583 18.0208 2 17.55 2 17V7C2 6.45 2.19583 5.97917 2.5875 5.5875C2.97917 5.19583 3.45 5 4 5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V8H20V7H4V17H11L9 19ZM22.9 12.3C22.9833 12.3833 23.025 12.475 23.025 12.575C23.025 12.675 22.9833 12.7667 22.9 12.85L22 13.75L20.25 12L21.15 11.1C21.2333 11.0167 21.325 10.975 21.425 10.975C21.525 10.975 21.6167 11.0167 21.7 11.1L22.9 12.3ZM21.4 14.35L15.05 20.7C14.95 20.8 14.8375 20.875 14.7125 20.925C14.5875 20.975 14.4583 21 14.325 21H13.5C13.3667 21 13.25 20.95 13.15 20.85C13.05 20.75 13 20.6333 13 20.5V19.675C13 19.5417 13.025 19.4125 13.075 19.2875C13.125 19.1625 13.2 19.05 13.3 18.95L19.65 12.6L21.4 14.35Z"
                  fill="#2C3E50"
                />
              </svg>
            )}

          {/* 
            Si la parcelle ne comporte aucun rosier non archivé 
            dont le délai d’édition* est écoulé, mettre l’icone “ok” 
          */}
          {!plot.est_archive &&
            plotHasNoRosierNonArchivedWithDelayEditionPassed && (
              // Icon Ok
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2_259)">
                  <path
                    d="M8.99965 16.1699L5.52965 12.6999C5.13965 12.3099 4.50965 12.3099 4.11965 12.6999C3.72965 13.0899 3.72965 13.7199 4.11965 14.1099L8.29965 18.2899C8.68965 18.6799 9.31965 18.6799 9.70965 18.2899L20.2896 7.70995C20.6796 7.31995 20.6796 6.68995 20.2896 6.29995C19.8997 5.90995 19.2696 5.90995 18.8796 6.29995L8.99965 16.1699Z"
                    fill="#4A8D4E"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2_259">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}

          {/* 
            Si la parcelle ne comporte aucun rosier non archivé 
            dont le délai d’édition* n'est pas écoulé, mettre l’icone "todo" 
          */}
          {!plot.est_archive &&
            observationsRosierByPlot &&
            observationsRosierByPlot.length > 0 &&
            !plotHasNoRosierNonArchivedWithDelayEditionPassed &&
            !plotHasAtLeastOneRosierNonArchivedWithDelayEditionPassed && (
              // Icon todo
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 15H13L15 13H7C6.71667 13 6.47917 13.0958 6.2875 13.2875C6.09583 13.4792 6 13.7167 6 14C6 14.2833 6.09583 14.5208 6.2875 14.7125C6.47917 14.9042 6.71667 15 7 15ZM7 11H11C11.2833 11 11.5208 10.9042 11.7125 10.7125C11.9042 10.5208 12 10.2833 12 10C12 9.71667 11.9042 9.47917 11.7125 9.2875C11.5208 9.09583 11.2833 9 11 9H7C6.71667 9 6.47917 9.09583 6.2875 9.2875C6.09583 9.47917 6 9.71667 6 10C6 10.2833 6.09583 10.5208 6.2875 10.7125C6.47917 10.9042 6.71667 11 7 11ZM9 19H4C3.45 19 2.97917 18.8042 2.5875 18.4125C2.19583 18.0208 2 17.55 2 17V7C2 6.45 2.19583 5.97917 2.5875 5.5875C2.97917 5.19583 3.45 5 4 5H20C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7V8H20V7H4V17H11L9 19ZM22.9 12.3C22.9833 12.3833 23.025 12.475 23.025 12.575C23.025 12.675 22.9833 12.7667 22.9 12.85L22 13.75L20.25 12L21.15 11.1C21.2333 11.0167 21.325 10.975 21.425 10.975C21.525 10.975 21.6167 11.0167 21.7 11.1L22.9 12.3ZM21.4 14.35L15.05 20.7C14.95 20.8 14.8375 20.875 14.7125 20.925C14.5875 20.975 14.4583 21 14.325 21H13.5C13.3667 21 13.25 20.95 13.15 20.85C13.05 20.75 13 20.6333 13 20.5V19.675C13 19.5417 13.025 19.4125 13.075 19.2875C13.125 19.1625 13.2 19.05 13.3 18.95L19.65 12.6L21.4 14.35Z"
                  fill="#2C3E50"
                />
              </svg>
            )}

          {/* 
            Si la parcelle ne comporte aucun rosier, mettre l’icone “ok” 
          */}
          {!plot.est_archive &&
            observationsRosierByPlot &&
            observationsRosierByPlot.length === 0 && (
              // Icon Ok
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2_259)">
                  <path
                    d="M8.99965 16.1699L5.52965 12.6999C5.13965 12.3099 4.50965 12.3099 4.11965 12.6999C3.72965 13.0899 3.72965 13.7199 4.11965 14.1099L8.29965 18.2899C8.68965 18.6799 9.31965 18.6799 9.70965 18.2899L20.2896 7.70995C20.6796 7.31995 20.6796 6.68995 20.2896 6.29995C19.8997 5.90995 19.2696 5.90995 18.8796 6.29995L8.99965 16.1699Z"
                    fill="#4A8D4E"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2_259">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}

          {plot.est_archive && (
            <button
              className="btn btn-ghost p-0 m-0"
              onClick={handleDeArchivePlot}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_27_2048)">
                  <path
                    d="M20.55 5.22L19.16 3.54C18.88 3.21 18.47 3 18 3H6C5.53 3 5.12 3.21 4.85 3.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V6.5C21 6.01 20.83 5.57 20.55 5.22ZM12.35 9.85L17.5 15H14V17H10V15H6.5L11.65 9.85C11.84 9.66 12.16 9.66 12.35 9.85ZM5.12 5L5.94 4H17.94L18.87 5H5.12Z"
                    fill="#2C3E50"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_27_2048">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CardPlot;
