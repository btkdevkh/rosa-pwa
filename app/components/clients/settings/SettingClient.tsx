"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import signout from "../../../firebase/auth/signout";
import SingleSelect from "../../selects/SingleSelect";
import PageWrapper from "../../shared/PageWrapper";
import { ExploitationContext } from "../../../context/ExploitationContext";
import PwaInstallPrompt from "../../PwaInstallPrompt";
import Loading from "../../shared/Loading";
import getPWADisplayMode from "@/app/helpers/getPWADisplayMode";
import useUserExploitations from "@/app/hooks/exploitations/useUserExploitations";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import { OptionType } from "@/app/models/types/OptionType";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";

const SettingClient = () => {
  const router = useRouter();

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

  // Select default exploitation
  useEffect(() => {
    if (!isClearable && !selectedOption && selectedExploitationOption) {
      setSelectedOption(selectedExploitationOption);
      setIsClearable(true);
    }
  }, [
    selectedOption,
    isClearable,
    selectedExploitationOption,
    handleSelectedExploitationOption,
  ]);

  // Keep track selected exploitation
  useEffect(() => {
    if (selectedOption) {
      handleSelectedExploitationOption(selectedOption as OptionTypeDashboard);
    }
  }, [selectedOption, handleSelectedExploitationOption]);

  // Trigger to fire "beforeinstallprompt" once
  useEffect(() => {
    router.replace(MenuUrlPath.SETTINGS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper
      pageTitle="Rospot | Paramètres"
      navBarTitle="Paramètres"
      // handleOnMouseEnter={handleOnMouseEnter}
    >
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

          <button
            className="flex justify-start gap-5 btn rounded-sm border-none bg-white w-full"
            onClick={signout}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.325 16.275C15.1417 16.0583 15.05 15.8123 15.05 15.537C15.05 15.2623 15.1417 15.0333 15.325 14.85L17.175 13H10C9.71667 13 9.47933 12.904 9.288 12.712C9.096 12.5207 9 12.2833 9 12C9 11.7167 9.096 11.479 9.288 11.287C9.47933 11.0957 9.71667 11 10 11H17.175L15.325 9.15C15.125 8.95 15.025 8.71267 15.025 8.438C15.025 8.16267 15.125 7.925 15.325 7.725C15.5083 7.525 15.7377 7.425 16.013 7.425C16.2877 7.425 16.5167 7.51667 16.7 7.7L20.3 11.3C20.4 11.4 20.471 11.5083 20.513 11.625C20.5543 11.7417 20.575 11.8667 20.575 12C20.575 12.1333 20.5543 12.2583 20.513 12.375C20.471 12.4917 20.4 12.6 20.3 12.7L16.7 16.3C16.4833 16.5167 16.246 16.6123 15.988 16.587C15.7293 16.5623 15.5083 16.4583 15.325 16.275ZM5 21C4.45 21 3.979 20.8043 3.587 20.413C3.19567 20.021 3 19.55 3 19V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H11C11.2833 3 11.521 3.09567 11.713 3.287C11.9043 3.479 12 3.71667 12 4C12 4.28333 11.9043 4.52067 11.713 4.712C11.521 4.904 11.2833 5 11 5H5V19H11C11.2833 19 11.521 19.096 11.713 19.288C11.9043 19.4793 12 19.7167 12 20C12 20.2833 11.9043 20.5207 11.713 20.712C11.521 20.904 11.2833 21 11 21H5Z"
                fill="#2C3E50"
              />
            </svg>
            <span className="text-txton1 font-normal">Me déconnecter</span>
          </button>
        </div>

        <br />

        {loading && <Loading />}

        {/* Exploitations that user had */}
        {exploitations && exploitations.length > 1 && (
          <SingleSelect
            data={exploitations}
            selectedOption={selectedOption}
            isClearable={isClearable}
            setSelectedOption={setSelectedOption}
            setIsClearable={setIsClearable}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default SettingClient;

// Trigger function to fire "beforeinstallprompt"
// const handleOnMouseEnter = (
//   e:
//     | React.MouseEvent<HTMLDivElement, MouseEvent>
//     | React.TouchEvent<HTMLDivElement>
// ) => {
//   e.preventDefault();
//   console.log("evt :", e);

//   setHasClickedOnButtonInMenuBar(true);

//   // Update pathname
//   if (previousPathname) {
//     previousPathname.current = MenuUrlPath.SETTINGS;
//     router.push(previousPathname.current);
//   }
// };
