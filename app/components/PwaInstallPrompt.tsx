"use client";

import { useEffect, useState } from "react";

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallClick = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(deferredPrompt as any)?.prompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (deferredPrompt as any).prompt();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { outcome } = await (deferredPrompt as any).userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return isInstallable ? (
    <button onClick={handleInstallClick} style={installButtonStyle}>
      Installer l&apos;appli
    </button>
  ) : null;
};

export default PwaInstallPrompt;

const installButtonStyle = {
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  position: "fixed" as "fixed",
  bottom: "20px",
  right: "20px",
  padding: "10px 20px",
  backgroundColor: "#000",
  color: "#fff",
  borderRadius: "5px",
  cursor: "pointer",
  border: "none",
  zIndex: 1000,
};
