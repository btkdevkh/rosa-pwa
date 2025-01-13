"use client";

import React from "react";
import { chantier } from "@/app/chantiers";
// import { useRouter, useSearchParams } from "next/navigation";
// import toastSuccess from "@/app/helpers/notifications/toastSuccess";

type RosierModalOptionsProps = {
  onClickDeleteRosier: () => void;
  onClickUpdateRosier: () => void;
};

const RosierModalOptions = ({
  onClickDeleteRosier,
  onClickUpdateRosier,
}: RosierModalOptionsProps) => {
  const handleArchiveRosier = () => {
    // @todo : DB stuffs
    console.log("@todo");
  };

  return (
    <div className="w-60">
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

      {chantier.archivage && (
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
