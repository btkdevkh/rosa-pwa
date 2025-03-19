"use client";

import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import signout from "../../../firebase/auth/signout";
import SingleSelect from "../../selects/SingleSelect";
import PageWrapper from "../../shared/wrappers/PageWrapper";
import { ExploitationContext } from "../../../context/ExploitationContext";
import getPWADisplayMode from "@/app/helpers/getPWADisplayMode";
import useUserExploitations from "@/app/hooks/exploitations/useUserExploitations";
import { OptionType } from "@/app/models/types/OptionType";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";
import PwaInstallPrompt from "../../shared/pwa/PwaInstallPrompt";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import Loading from "../../shared/loaders/Loading";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import LogoutIcon from "../../shared/icons/LogoutIcon";
import DownloadIcon from "../../shared/icons/DownloadIcon";
import { chantier } from "@/app/chantiers";

const SettingClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const {
    deferredPrompt,
    selectedExploitationOption,
    handleSelectedExploitationOption,
  } = useContext(ExploitationContext);
  const { loading, exploitations } = useUserExploitations();

  const [selectedOption, setSelectedOption] = useState<
    OptionType | OptionTypeDashboard | null
  >(null);

  const [isClearable, setIsClearable] = useState<boolean>(false);
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

  useEffect(() => {
    if (
      !selectedExploitationOption &&
      exploitations &&
      exploitations.length > 0
    ) {
      setSelectedOption(exploitations[0]);
      setIsClearable(true);
    }
  }, [selectedExploitationOption, exploitations]);

  // Selected exploitation
  useEffect(() => {
    if (!isClearable && !selectedOption && selectedExploitationOption) {
      setSelectedOption(selectedExploitationOption);
      setIsClearable(true);
    }
  }, [selectedOption, isClearable, selectedExploitationOption]);

  // Keep track selected exploitation
  useEffect(() => {
    if (selectedOption) {
      handleSelectedExploitationOption(selectedOption as OptionTypeDashboard);
    }
  }, [selectedOption, handleSelectedExploitationOption]);

  // Trigger to fire "beforeinstallprompt" once
  // Trigger when onchanged exploitation
  useEffect(() => {
    if (pathname === MenuUrlPath.SETTINGS && selectedExploitationOption) {
      const explIDChanged = selectedExploitationOption.id;
      const explNameChanged = selectedExploitationOption.value;
      const dashboardIDChanged =
        selectedExploitationOption.dashboard &&
        selectedExploitationOption.dashboard.id
          ? selectedExploitationOption.dashboard.id
          : null;
      const hadDashboardChanged = selectedExploitationOption.had_dashboard;

      const pathUrlChanged = `${MenuUrlPath.SETTINGS}?explID=${explIDChanged}&explName=${explNameChanged}&dashboardID=${dashboardIDChanged}&hadDashboard=${hadDashboardChanged}`;
      router.replace(pathUrlChanged);
    }
  }, [pathname, router, selectedExploitationOption, dashboardID, hadDashboard]);

  return (
    <PageWrapper pageTitle="Rospot | Paramètres" navBarTitle="Paramètres">
      {/* Content */}
      <div className="container">
        <div className="flex flex-col gap-4">
          {/* Add the install prompt component */}
          <PwaInstallPrompt
            {...{
              isStandalone,
              handleClickInstallApp,
            }}
          />

          {chantier.CHANTIER_9.unMask && (
            <Link
              href={`/observations/downloadData?explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`}
              prefetch={true}
              className="flex justify-start gap-5 btn rounded-sm border-none bg-white w-full"
            >
              <DownloadIcon />
              <span className="text-txton1 font-normal">
                Télécharger mes données
              </span>
            </Link>
          )}

          <Link
            href="/login"
            prefetch={true}
            onClick={signout}
            className="flex justify-start gap-5 btn rounded-sm border-none bg-white w-full"
          >
            <LogoutIcon />
            <span className="text-txton1 font-normal">Me déconnecter</span>
          </Link>
        </div>

        {/* Loading */}
        {loading && <Loading />}
        <br />

        {/* Exploitations that user had */}
        {exploitations && exploitations.length > 1 && (
          <SingleSelect
            data={exploitations}
            selectedOption={selectedOption}
            isClearable={isClearable}
            setSelectedOption={
              setSelectedOption as Dispatch<
                SetStateAction<
                  OptionType | OptionTypeIndicator | OptionTypeDashboard | null
                >
              >
            }
            setIsClearable={setIsClearable}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default SettingClient;
