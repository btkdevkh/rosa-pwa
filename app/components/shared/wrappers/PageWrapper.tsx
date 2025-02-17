"use client";

import { ReactNode, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";
import { RouteDetectorContext } from "../../../context/RouteDetectorContext";
import MenuBar from "../menus/MenuBar";
import Navbar from "../menus/Navbar";
import ModalGenericConfirm from "../../modals/ModalGenericConfirm";

type PageWrapperProps = {
  children: ReactNode;
  pageTitle: string;
  navBarTitle: string;
  back?: boolean;
  emptyData?: boolean;
  pathUrl?: string;
  handleOnMouseEnter?: (
    evt:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => void;
};

const PageWrapper = ({
  children,
  pageTitle,
  navBarTitle,
  back = false,
  emptyData,
  pathUrl,
  handleOnMouseEnter,
}: PageWrapperProps) => {
  const router = useRouter();

  const { authenticatedUser } = use(AuthContext);

  const {
    previousPathname,
    hasClickedOnBackButtonInNavBar,
    hasClickedOnButtonInMenuBar,
    hasClickedOnContinueButton,
  } = use(RouteDetectorContext);

  // Detect when navbar back button has clicked
  useEffect(() => {
    if (
      previousPathname &&
      hasClickedOnBackButtonInNavBar &&
      hasClickedOnContinueButton
    ) {
      router.push(previousPathname.current);
    }
  }, [
    router,
    previousPathname,
    hasClickedOnBackButtonInNavBar,
    hasClickedOnContinueButton,
  ]);

  // Detect when menu item button has clicked
  useEffect(() => {
    if (
      previousPathname &&
      hasClickedOnButtonInMenuBar &&
      hasClickedOnContinueButton
    ) {
      router.push(previousPathname.current);
    }
  }, [
    router,
    previousPathname,
    hasClickedOnButtonInMenuBar,
    hasClickedOnContinueButton,
  ]);

  return (
    <>
      {authenticatedUser && (
        <>
          <title>{pageTitle}</title>
          <div
            className="flex flex-col h-full"
            onMouseEnter={handleOnMouseEnter}
            onTouchStart={handleOnMouseEnter}
          >
            {/* Top Nav bar */}
            <Navbar
              title={navBarTitle}
              back={back}
              emptyData={emptyData}
              pathUrl={pathUrl}
            />

            {children}

            {/* Bottom Menu bar */}
            <div className="mt-auto">
              <MenuBar emptyData={emptyData} />
            </div>

            <br />
            <br />

            {/* Modal de confirmation générique */}
            {emptyData == false && !hasClickedOnContinueButton && (
              <ModalGenericConfirm />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PageWrapper;
