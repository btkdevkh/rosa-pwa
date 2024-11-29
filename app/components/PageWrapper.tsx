import React, { ReactNode, useContext, useEffect } from "react";
import { RouteDetectorContext } from "../context/RouteDetectorContext";
import ModalGenericConfirm from "./modals/ModalGenericConfirm";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();

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
        {emptyData == false && !hasClickedOnContinueButton && (
          <ModalGenericConfirm />
        )}
      </div>
    </>
  );
};

export default PageWrapper;
