"use client";

import React, { use } from "react";
import { Rosier } from "@/app/models/interfaces/Rosier";
import { useRouter, useSearchParams } from "next/navigation";
import usePlots from "@/app/hooks/plots/usePlots";
import { ExploitationContext } from "@/app/context/ExploitationContext";

type CardRosierProps = {
  rosier: Rosier;
};

const CardRosier = ({ rosier }: CardRosierProps) => {
  const router = useRouter();

  const serachParams = useSearchParams();
  const plotParamID = serachParams.get("plotID");
  const plotParamName = serachParams.get("plotName");
  const plotParamArchived = serachParams.get("archived");

  const { selectedExploitationOption } = use(ExploitationContext);
  const { observations: observationData } = usePlots(
    selectedExploitationOption?.id
  );

  const observationsByRosier = observationData?.filter(
    obs => rosier.id === obs.id_rosier
  );

  // Si le délai d’édition* du rosier est écoulé.
  const rosierDelayEditionPassed =
    observationsByRosier && observationsByRosier.length > 0
      ? observationsByRosier.every(obs => {
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
            (obsYY && currYY > +obsYY) ||
            (obsMM === currMM && obsYY === currYY && currDD - +obsDD > 3)
          );
        })
      : false;

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

          {rosierDelayEditionPassed ? (
            <>
              {/* Si le délai d’édition* du rosier est écoulé, mettre l’icone “todo” */}
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
            </>
          ) : (
            <>
              {/* Si le délai d’édition* du rosier n’est pas écoulé, mettre l’icone “ok” */}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CardRosier;
