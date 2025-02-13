"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import TodoIcon from "../../shared/icons/TodoIcon";
import OkIcon from "../../shared/icons/OkIcon";
import { Observation } from "@/app/models/interfaces/Observation";
import { Rosier } from "@/app/models/interfaces/Rosier";

type CardPlotProps = {
  plot: Parcelle;
  rosiers: Rosier[] | null;
  observations: Observation[] | null;
};

const CardPlot = ({
  plot,
  rosiers: rosierData,
  observations: observationData,
}: CardPlotProps) => {
  const router = useRouter();

  // const { selectedExploitationOption } = use(ExploitationContext);
  // const { rosiers: rosierData, observations: observationData } = usePlots(
  //   selectedExploitationOption?.id
  // );

  // Current date
  const currDate = new Date();
  const currDD = currDate.getDate();
  const currMM = currDate.getMonth() + 1;
  const currYY = currDate.getFullYear();

  const rosiersFiltredByPlotID = rosierData?.filter(
    rosier => plot.id && rosier.id_parcelle && +rosier.id_parcelle === +plot.id
  );

  const observationsByRosierID = observationData
    ?.map(obs => {
      if (rosiersFiltredByPlotID && rosiersFiltredByPlotID.length > 0) {
        for (const rosier of rosiersFiltredByPlotID) {
          if (rosier.id && rosier.id === obs.id_rosier) {
            // Obs date
            const obsDate = new Date(obs.timestamp as Date);
            const obsDD = obsDate.getDate();
            const obsMM = obsDate.getMonth() + 1;
            const obsYY = obsDate.getFullYear();

            const delayPassed =
              (currYY && obsYY && currYY > obsYY) ||
              (obsYY &&
                obsMM &&
                obsDD &&
                currYY &&
                currMM &&
                currDD &&
                obsYY === currYY &&
                obsMM === currMM &&
                currDD - +obsDD > 3) ||
              (obsYY &&
                obsMM &&
                obsDD &&
                currYY &&
                currMM &&
                currYY === +obsYY &&
                currMM > +obsMM);

            if (!delayPassed) {
              rosier.okIcon = true;
              rosier.todoIcon = false;
            } else {
              rosier.todoIcon = true;
              rosier.okIcon = false;
            }

            return {
              ...obs,
              delai_passed: delayPassed,
              rosier_est_archive: rosier.est_archive,
              id_parcelle: plot.id,
              okIcon: delayPassed == false ? true : false,
            } as Observation;
          }
        }
      }
    })
    .filter(obs => obs != undefined)
    .sort((a, b) =>
      new Date(b.timestamp as Date)
        .toLocaleDateString()
        .localeCompare(new Date(a.timestamp as Date).toLocaleDateString())
    );

  const handleDeArchivePlot = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    console.log("@todo");
  };

  // console.log("Parcelle :", plot.nom);
  // console.log("rosiersFiltredByPlotID :", rosiersFiltredByPlotID);
  // console.log("observationsByRosierID :", observationsByRosierID);
  // console.log("--------------------------------------------------");

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

          <div className="flex items-center gap-3">
            <>
              {/* TODO icon */}
              {rosiersFiltredByPlotID &&
                rosiersFiltredByPlotID.length > 0 &&
                rosiersFiltredByPlotID.some(
                  rosier =>
                    rosier.todoIcon == true || rosier.todoIcon == undefined
                ) && <TodoIcon />}

              {rosiersFiltredByPlotID &&
                rosiersFiltredByPlotID.length === 0 &&
                observationsByRosierID &&
                observationsByRosierID.length === 0 && <TodoIcon />}

              {/* OK icon */}
              {rosiersFiltredByPlotID &&
                rosiersFiltredByPlotID.length > 0 &&
                rosiersFiltredByPlotID.every(rosier => rosier.okIcon) && (
                  <OkIcon />
                )}
            </>
          </div>

          {/* Parcelle est archivée */}
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
