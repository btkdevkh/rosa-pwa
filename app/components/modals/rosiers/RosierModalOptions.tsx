"use client";

import React from "react";
import { chantier } from "@/app/chantiers";
// import { useRouter, useSearchParams } from "next/navigation";
// import toastSuccess from "@/app/helpers/notifications/toastSuccess";

type RosierModalOptionsProps = {
  showArchivedRosiers: boolean;
  onClickDeleteRosier: () => void;
  onClickUpdateRosier: () => void;
  setShowArchivedRosiers: (value: boolean) => void;
};

const RosierModalOptions = ({
  // showArchivedRosiers,
  onClickDeleteRosier,
  onClickUpdateRosier,
}: // setShowArchivedRosiers,
RosierModalOptionsProps) => {
  const handleArchiveRosier = () => {
    // @todo : DB stuffs
  };

  return (
    <div className="w-60">
      {chantier.CHANTIER_2.sup && (
        <>
          {/* Afficher les rosiers archivés */}
          {/*  
          {showArchivedRosiers ? (
            <div className="flex gap-5 items-center">
              <button
                className="btn btn-ghost p-0 m-0"
                onClick={() => setShowArchivedRosiers(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_5_4616)">
                    <path
                      d="M12 6.50005C14.76 6.50005 17 8.74005 17 11.5001C17 12.0101 16.9 12.5001 16.76 12.9601L19.82 16.0201C21.21 14.7901 22.31 13.2501 23 11.4901C21.27 7.11005 17 4.00005 12 4.00005C10.73 4.00005 9.51 4.20005 8.36 4.57005L10.53 6.74005C11 6.60005 11.49 6.50005 12 6.50005ZM2.71 3.16005C2.32 3.55005 2.32 4.18005 2.71 4.57005L4.68 6.54005C3.06 7.83005 1.77 9.53005 1 11.5001C2.73 15.8901 7 19.0001 12 19.0001C13.52 19.0001 14.97 18.7001 16.31 18.1801L19.03 20.9001C19.42 21.2901 20.05 21.2901 20.44 20.9001C20.83 20.5101 20.83 19.8801 20.44 19.4901L4.13 3.16005C3.74 2.77005 3.1 2.77005 2.71 3.16005ZM12 16.5001C9.24 16.5001 7 14.2601 7 11.5001C7 10.7301 7.18 10.0001 7.49 9.36005L9.06 10.9301C9.03 11.1101 9 11.3001 9 11.5001C9 13.1601 10.34 14.5001 12 14.5001C12.2 14.5001 12.38 14.4701 12.57 14.4301L14.14 16.0001C13.49 16.3201 12.77 16.5001 12 16.5001ZM14.97 11.1701C14.82 9.77005 13.72 8.68005 12.33 8.53005L14.97 11.1701Z"
                      fill="#2C3E50"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5_4616">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="font-normal">
                  Masquer les rosiers archivés
                </span>
              </button>
            </div>
          ) : (
            <div className="flex gap-5 items-center">
              <button
                className="btn btn-ghost p-0 m-0"
                onClick={() => setShowArchivedRosiers(true)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2_291)">
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                      fill="#2C3E50"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2_291">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="font-normal">
                  Afficher les rosiers archivés
                </span>
              </button>
            </div>
          )}
          */}
        </>
      )}

      {/* Éditer le rosier */}
      <div className="flex gap-5 items-center">
        <button className="btn btn-ghost p-0 m-0" onClick={onClickUpdateRosier}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_247_10199)">
              <path
                d="M3 17.4601V20.5001C3 20.7801 3.22 21.0001 3.5 21.0001H6.54C6.67 21.0001 6.8 20.9501 6.89 20.8501L17.81 9.94006L14.06 6.19006L3.15 17.1001C3.05 17.2001 3 17.3201 3 17.4601ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z"
                fill="#2C3E50"
              />
            </g>
            <defs>
              <clipPath id="clip0_247_10199">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="font-normal">Éditer le rosier</span>
        </button>
      </div>

      {!chantier.CHANTIER_2.sup && (
        <>
          {/* Archiver le rosier */}
          <div className="flex gap-5 items-center">
            <button
              className="btn btn-ghost p-0 m-0"
              onClick={handleArchiveRosier}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_12_7051)">
                  <path
                    d="M20.54 5.23L19.15 3.55C18.88 3.21 18.47 3 18 3H6C5.53 3 5.12 3.21 4.84 3.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V6.5C21 6.02 20.83 5.57 20.54 5.23ZM11.65 17.15L6.5 12H10V10H14V12H17.5L12.35 17.15C12.16 17.34 11.84 17.34 11.65 17.15ZM5.12 5L5.93 4H17.93L18.87 5H5.12Z"
                    fill="#2C3E50"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_12_7051">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="font-normal">Archiver le rosier</span>
            </button>
          </div>
        </>
      )}

      {/* Supprimer le rosier */}
      <div className="flex gap-5 items-center">
        <button className="btn btn-ghost p-0 m-0" onClick={onClickDeleteRosier}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_247_10220)">
              <path
                d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 6 9V19ZM18 4H15.5L14.79 3.29C14.61 3.11 14.35 3 14.09 3H9.91C9.65 3 9.39 3.11 9.21 3.29L8.5 4H6C5.45 4 5 4.45 5 5C5 5.55 5.45 6 6 6H18C18.55 6 19 5.55 19 5C19 4.45 18.55 4 18 4Z"
                fill="#2C3E50"
              />
            </g>
            <defs>
              <clipPath id="clip0_247_10220">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="font-normal">Supprimer le rosier</span>
        </button>
      </div>
    </div>
  );
};

export default RosierModalOptions;
