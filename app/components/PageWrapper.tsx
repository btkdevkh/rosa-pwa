import React, { ReactNode, useContext, useEffect } from "react";
import { RouteDetectorContext } from "../context/RouteDetectorContext";
import ModalGenericConfirm from "./modals/ModalGenericConfirm";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";

type PageWrapperProps = {
  children: ReactNode;
  pageTitle: string;
  navBarTitle: string;
  back?: boolean;
  emptyData?: boolean;
};

const PageWrapper = ({
  children,
  pageTitle,
  navBarTitle,
  back = false,
  emptyData,
}: PageWrapperProps) => {
  const {
    previousPathname,
    hasClickedOnBackButtonInNavBar,
    hasClickedOnButtonInMenuBar,
    setHasClickedOnBackButtonInNavBar,
    setHasClickedOnButtonInMenuBar,
  } = useContext(RouteDetectorContext);

  // Detecter si l'utilisateur clique sur le bouton
  // de retour et que les données sont vides
  useEffect(() => {
    if (hasClickedOnBackButtonInNavBar && emptyData) {
      const generic_confirm_modal = document.getElementById(
        "generic_confirm_modal"
      ) as HTMLDialogElement;

      if (generic_confirm_modal) {
        generic_confirm_modal.showModal();
      }
    }
  }, [hasClickedOnBackButtonInNavBar, emptyData]);

  useEffect(() => {
    if (hasClickedOnButtonInMenuBar && emptyData) {
      const generic_confirm_modal = document.getElementById(
        "generic_confirm_modal"
      ) as HTMLDialogElement;

      if (generic_confirm_modal) {
        generic_confirm_modal.showModal();
      }
    }
  }, [hasClickedOnButtonInMenuBar, emptyData]);

  return (
    <>
      <title>{pageTitle}</title>
      <div className="flex flex-col h-screen">
        {/* Top Nav bar */}
        <Navbar title={navBarTitle} back={back} emptyData={emptyData} />

        {children}

        {/* Bottom Menu bar */}
        <div className="mt-auto">
          <MenuBar emptyData={emptyData} />
        </div>

        {/* Modal de confirmation générique */}
        {hasClickedOnBackButtonInNavBar && !hasClickedOnButtonInMenuBar && (
          <ModalGenericConfirm
            handleConfirmCancel={() => {
              setHasClickedOnBackButtonInNavBar(false);
            }}
            handleConfirmContinue={() => {
              setHasClickedOnBackButtonInNavBar(true);
            }}
            url={previousPathname?.current}
          />
        )}

        {hasClickedOnButtonInMenuBar && !hasClickedOnBackButtonInNavBar && (
          <ModalGenericConfirm
            handleConfirmCancel={() => {
              setHasClickedOnButtonInMenuBar(false);
            }}
            handleConfirmContinue={() => {
              setHasClickedOnButtonInMenuBar(true);
            }}
            url={previousPathname?.current}
          />
        )}
      </div>
    </>
  );
};

export default PageWrapper;
