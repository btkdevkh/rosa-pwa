"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PwaInstallPrompt = () => {
  const router = useRouter();

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Need to replace route in history
    // to trigger the install prompt event
    router.replace("/settings");

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    const standaloneMode = "(display-mode: standalone)";
    const isPWAInstalled = () => window.matchMedia(standaloneMode).matches;

    if (isPWAInstalled()) {
      console.log("PWA is installed and running in standalone mode.");
      setIsInstallable(false);
    } else {
      console.log("PWA is not installed.");
      setIsInstallable(true);
    }

    // Cleanup
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
  }, [router]);

  const handleInstallClick = async () => {
    if (!deferredPrompt?.prompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Reset the deferred prompt
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return isInstallable ? (
    <button
      className="flex justify-start gap-5 btn rounded-sm border-none bg-white w-full"
      // style={installButtonStyle}
      onClick={() => {
        // Need to replace route in history
        // to trigger the install prompt event
        router.replace("/settings");

        handleInstallClick();
      }}
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
  ) : null;
};

export default PwaInstallPrompt;

// const installButtonStyle = {
//   // eslint-disable-next-line @typescript-eslint/prefer-as-const
//   position: "fixed" as "fixed",
//   bottom: "20px",
//   right: "20px",
//   padding: "10px 20px",
//   backgroundColor: "#000",
//   color: "#fff",
//   borderRadius: "5px",
//   cursor: "pointer",
//   border: "none",
//   zIndex: 1000,
// };
