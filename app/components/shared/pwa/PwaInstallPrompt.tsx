"use client";

import { useContext, useEffect } from "react";
import getPWADisplayMode from "@/app/helpers/getPWADisplayMode";
import { ExploitationContext } from "@/app/context/ExploitationContext";

declare global {
  interface Navigator {
    standalone: boolean;
  }
}

type PwaInstallPromptProps = {
  isStandalone: boolean;
  handleClickInstallApp: () => void;
};

const PwaInstallPrompt = ({
  isStandalone,
  handleClickInstallApp,
}: PwaInstallPromptProps) => {
  const { deferredPrompt } = useContext(ExploitationContext);

  useEffect(() => {
    if (isStandalone) {
      console.log("PWA is installed and running in standalone mode.");
    } else {
      console.log("PWA is not installed or running in chrome browser.");
    }
  }, [isStandalone]);

  // Hide install button when these conditions mets
  if (isStandalone || !deferredPrompt || getPWADisplayMode() === "standalone") {
    return null;
  }

  return (
    <button
      className="flex justify-start gap-5 btn rounded-sm border-none bg-white w-full"
      onClick={handleClickInstallApp}
    >
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1444_5866)">
          <path
            d="M18.71 13.79L22.3 10.2C22.69 9.81 22.69 9.18 22.3 8.79C21.91 8.4 21.28 8.4 20.89 8.79L19 10.67V4.5C19 3.95 18.55 3.5 18 3.5C17.45 3.5 17 3.95 17 4.5V10.67L15.11 8.79C14.72 8.4 14.09 8.4 13.7 8.79C13.31 9.18 13.31 9.81 13.7 10.2L17.29 13.79C17.69 14.18 18.32 14.18 18.71 13.79Z"
            fill="#434343"
          />
          <path
            d="M17 18.5H7V6.5H14V1.5H7C5.9 1.5 5 2.4 5 3.5V21.5C5 22.6 5.9 23.5 7 23.5H17C18.1 23.5 19 22.6 19 21.5V16.5H17V18.5Z"
            fill="#434343"
          />
        </g>
        <defs>
          <clipPath id="clip0_1444_5866">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0 0.5)"
            />
          </clipPath>
        </defs>
      </svg>

      <span className="text-txton1 font-normal">
        Installer l&apos;application
      </span>
    </button>
  );
};

export default PwaInstallPrompt;
