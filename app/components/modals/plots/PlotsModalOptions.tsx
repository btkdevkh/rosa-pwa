import { chantier } from "@/app/chantiers";
import React from "react";

type PlotsModalOptionsProps = {
  showArchivedPlots: boolean;
  setShowArchivedPlots: (value: boolean) => void;
  onClickAddPlot: () => void;
};

const PlotsModalOptions = ({
  showArchivedPlots,
  onClickAddPlot,
  setShowArchivedPlots,
}: PlotsModalOptionsProps) => {
  return (
    <div className="absolute top-12 -right-4">
      <div className="modal-box px-4 py-2 w-full">
        <div className="w-72">
          <div className="flex gap-5 items-center">
            <button className="btn btn-ghost p-0 m-0" onClick={onClickAddPlot}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_247_10206)">
                  <path
                    d="M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z"
                    fill="#2C3E50"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_247_10206">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <p>Créer une parcelle</p>
          </div>

          {chantier.CHANTIER_2.sup && (
            <div className="flex gap-5 items-center">
              {showArchivedPlots ? (
                <>
                  <button
                    className="btn btn-ghost p-0 m-0"
                    onClick={() => setShowArchivedPlots(false)}
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
                  </button>
                  <p>Masquer les parcelles archivées</p>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-ghost p-0 m-0"
                    onClick={() => setShowArchivedPlots(true)}
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
                  </button>

                  <p>Afficher les parcelles archivées</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlotsModalOptions;
