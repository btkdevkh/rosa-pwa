"use client";

import React from "react";
import { Rosier } from "@/app/models/interfaces/Rosier";
import { useRouter, useSearchParams } from "next/navigation";
import OkIcon from "../../shared/icons/OkIcon";
import TodoIcon from "../../shared/icons/TodoIcon";
import { Observation } from "@/app/models/interfaces/Observation";

type CardRosierProps = {
  rosier: Rosier;
  observations: Observation[] | null;
};

const CardRosier = ({
  rosier,
  observations: observationData,
}: CardRosierProps) => {
  const router = useRouter();

  const serachParams = useSearchParams();
  const plotParamID = serachParams.get("plotID");
  const plotParamName = serachParams.get("plotName");
  const plotParamArchived = serachParams.get("archived");

  const observationsByRosier = observationData?.filter(
    obs => rosier.id === obs.id_rosier
  );

  // Si le délai d’édition* du rosier est écoulé.
  const rosierDelayEditionPassed =
    observationsByRosier &&
    observationsByRosier.length > 0 &&
    observationsByRosier.every(obs => {
      // Current date
      const currDate = new Date();
      const currDD = currDate.getDate();
      const currMM = currDate.getMonth() + 1;
      const currYY = currDate.getFullYear();

      // Obs date
      const obsDate = new Date(obs.timestamp as Date);
      const obsDD = obsDate.getDate();
      const obsMM = obsDate.getMonth() + 1;
      const obsYY = obsDate.getFullYear();

      return (
        (currYY && obsYY && currYY > +obsYY) ||
        (obsYY &&
          obsMM &&
          obsDD &&
          currYY &&
          currMM &&
          currDD &&
          currYY === +obsYY &&
          currMM === +obsMM &&
          currDD - +obsDD > 3) ||
        (obsYY &&
          obsMM &&
          obsDD &&
          currYY &&
          currMM &&
          currYY === +obsYY &&
          currMM > +obsMM)
      );
    });

  // console.log("observationsByRosier :", observationsByRosier);
  // console.log("rosierDelayEditionPassed :", rosierDelayEditionPassed);

  return (
    <>
      <div
        className="card bg-base-100 w-full shadow-md cursor-pointer"
        onClick={() => {
          router.push(
            `/observations/plots/rosiers/rosier?rosierID=${rosier.id}&rosierName=${rosier.nom}&plotID=${plotParamID}&plotName=${plotParamName}&archived=${plotParamArchived}`
          );
        }}
      >
        <div
          className={`flex justify-between items-center ${
            rosier.est_archive ? "py-[0.5] px-3" : "p-3"
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
              <g clipPath="url(#clip0_12_6457)">
                <path
                  d="M11.9997 22C16.5597 22 20.3297 18.6 20.9197 14.2C21.0097 13.56 20.4397 12.99 19.7997 13.08C15.3997 13.67 11.9997 17.44 11.9997 22ZM5.59971 10.25C5.59971 11.63 6.71971 12.75 8.09971 12.75C8.62971 12.75 9.10971 12.59 9.51971 12.31L9.49971 12.5C9.49971 13.88 10.6197 15 11.9997 15C13.3797 15 14.4997 13.88 14.4997 12.5L14.4797 12.31C14.8797 12.59 15.3697 12.75 15.8997 12.75C17.2797 12.75 18.3997 11.63 18.3997 10.25C18.3997 9.25 17.8097 8.4 16.9697 8C17.8097 7.6 18.3997 6.75 18.3997 5.75C18.3997 4.37 17.2797 3.25 15.8997 3.25C15.3697 3.25 14.8897 3.41 14.4797 3.69L14.4997 3.5C14.4997 2.12 13.3797 1 11.9997 1C10.6197 1 9.49971 2.12 9.49971 3.5L9.51971 3.69C9.11971 3.41 8.62971 3.25 8.09971 3.25C6.71971 3.25 5.59971 4.37 5.59971 5.75C5.59971 6.75 6.18971 7.6 7.02971 8C6.18971 8.4 5.59971 9.25 5.59971 10.25ZM11.9997 5.5C13.3797 5.5 14.4997 6.62 14.4997 8C14.4997 9.38 13.3797 10.5 11.9997 10.5C10.6197 10.5 9.49971 9.38 9.49971 8C9.49971 6.62 10.6197 5.5 11.9997 5.5ZM3.07971 14.2C3.66971 18.6 7.43971 22 11.9997 22C11.9997 17.44 8.59971 13.67 4.19971 13.08C3.55971 12.99 2.98971 13.56 3.07971 14.2Z"
                  fill="#2C3E50"
                />
              </g>
              <defs>
                <clipPath id="clip0_12_6457">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <div>
              <h2>
                {rosier.nom.length > 20
                  ? rosier.nom.slice(0, 20) + "..."
                  : rosier.nom}
              </h2>

              {rosier.est_archive && (
                <span className="text-txton2 text-xs">Archivée</span>
              )}
            </div>
          </div>

          {/* Si le délai d’édition* du rosier est écoulé, mettre l’icone “todo” */}
          {observationsByRosier &&
            observationsByRosier.length > 0 &&
            rosierDelayEditionPassed == true && <TodoIcon />}

          {/* Si le délai d’édition* du rosier n’est pas écoulé, mettre l’icone “ok” */}
          {observationsByRosier &&
            observationsByRosier.length > 0 &&
            rosierDelayEditionPassed == false && <OkIcon />}

          {/* S'il n'y a aucune observation sur un rosier, l'icone doit être "todo" */}
          {observationsByRosier && observationsByRosier.length === 0 && (
            <TodoIcon />
          )}
        </div>
      </div>
    </>
  );
};

export default CardRosier;
