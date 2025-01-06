import React, { ReactNode, useContext, useEffect } from "react";
import { RouteDetectorContext } from "../../context/RouteDetectorContext";
import ModalGenericConfirm from "../modals/ModalGenericConfirm";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

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
  const pathname = usePathname();
  const { authenticatedUser } = useContext(AuthContext);

  const {
    previousPathname,
    hasClickedOnBackButtonInNavBar,
    hasClickedOnButtonInMenuBar,
    hasClickedOnContinueButton,
  } = useContext(RouteDetectorContext);

  // Detect when navbar back button has clicked
  useEffect(() => {
    if (hasClickedOnBackButtonInNavBar && hasClickedOnContinueButton) {
      if (pathname.includes("/observations/plots/")) {
        router.push("/observations");
      } else {
        router.back();
      }
    }
  }, [
    hasClickedOnBackButtonInNavBar,
    hasClickedOnContinueButton,
    router,
    pathname,
  ]);

  // Detect when menu item button has clicked
  useEffect(() => {
    if (hasClickedOnButtonInMenuBar && hasClickedOnContinueButton) {
      router.push(previousPathname ? previousPathname.current : "/");
    }
  }, [
    hasClickedOnButtonInMenuBar,
    hasClickedOnContinueButton,
    router,
    previousPathname,
  ]);

  return (
    <>
      {authenticatedUser && (
        <>
          <title>{pageTitle}</title>
          <div
            className="flex flex-col h-screen"
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
