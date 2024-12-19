"use client";

import React, { useContext, useEffect, useState } from "react";
import Loading from "../components/shared/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";
import { ExploitationContext } from "../context/ExploitationContext";
import getPWADisplayMode from "../helpers/getPWADisplayMode";
import { BeforeInstallPromptEvent } from "../models/interfaces/BeforeInstallPromptEvent";
import useUserExploitations from "../hooks/exploitations/useUserExploitations";

const SettingPage = () => {
  const { deferredPrompt, setDeferredPrompt } = useContext(ExploitationContext);
  const { loading, exploitations: userExploitations } = useUserExploitations();

  const [isStandalone, setIsStandalone] = useState(false);

  // Click on install app button
  const handleClickInstallApp = async () => {
    if (!deferredPrompt?.prompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
  };

  // Detect "standalone" mode
  useEffect(() => {
    const isStandaloneMode = getPWADisplayMode() === "standalone";
    setIsStandalone(isStandaloneMode);
  }, []);

  // Assigne "beforeinstallprompt" to state on "/settings" page
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, [setDeferredPrompt]);

  // Loading
  if (loading) {
    return <Loading />;
  }

  return (
    <SettingPageClient
      exploitations={userExploitations || []}
      {...{
        isStandalone,
        handleClickInstallApp,
      }}
    />
  );
};

export default SettingPage;
