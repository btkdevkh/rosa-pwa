"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type RouteDetectorContextDataType = {
  routeHasChanged: boolean;
  hasClickedOnBackButtonInNavBar: boolean;
  hasClickedOnButtonInMenuBar: boolean;
  hasClickedOnContinueButton: boolean;
  previousPathname: MutableRefObject<string> | null;
  setHasClickedOnBackButtonInNavBar: (value: boolean) => void;
  setHasClickedOnButtonInMenuBar: (value: boolean) => void;
  setHasClickedOnContinueButton: (value: boolean) => void;
};

type RouteDetectorContextProviderProps = {
  children: ReactNode;
};

const initialRouteDetectorContextData: RouteDetectorContextDataType = {
  routeHasChanged: false,
  hasClickedOnBackButtonInNavBar: false,
  hasClickedOnButtonInMenuBar: false,
  hasClickedOnContinueButton: false,
  previousPathname: null,
  setHasClickedOnBackButtonInNavBar: () => {},
  setHasClickedOnButtonInMenuBar: () => {},
  setHasClickedOnContinueButton: () => {},
};

export const RouteDetectorContext = createContext(
  initialRouteDetectorContextData
);

const RouteDetectorContextProvider = ({
  children,
}: RouteDetectorContextProviderProps) => {
  const [routeHasChanged, setRouteHasChanged] = useState<boolean>(false);
  const [hasClickedOnBackButtonInNavBar, setHasClickedOnBackButtonInNavBar] =
    useState<boolean>(false);
  const [hasClickedOnButtonInMenuBar, setHasClickedOnButtonInMenuBar] =
    useState<boolean>(false);
  const [hasClickedOnContinueButton, setHasClickedOnContinueButton] =
    useState<boolean>(false);

  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    setRouteHasChanged(false);
    setHasClickedOnBackButtonInNavBar(false);
    setHasClickedOnButtonInMenuBar(false);
    setHasClickedOnContinueButton(false);

    if (previousPathname.current !== pathname) {
      setRouteHasChanged(true);
      // console.log(
      //   `Route changed from ${previousPathname.current} to ${pathname}`
      // );

      // Update the previous path
      previousPathname.current = pathname;
    }
  }, [pathname]);

  // console.log("routeHasChanged :", routeHasChanged);
  // console.log(
  //   "hasClickedOnBackButtonInNavBar :",
  //   hasClickedOnBackButtonInNavBar
  // );
  // console.log("hasClickedOnButtonInMenuBar :", hasClickedOnButtonInMenuBar);
  // console.log("previousPathname :", previousPathname);

  return (
    <RouteDetectorContext.Provider
      value={{
        routeHasChanged,
        hasClickedOnBackButtonInNavBar,
        hasClickedOnButtonInMenuBar,
        hasClickedOnContinueButton,
        previousPathname,
        setHasClickedOnBackButtonInNavBar,
        setHasClickedOnButtonInMenuBar,
        setHasClickedOnContinueButton,
      }}
    >
      {children}
    </RouteDetectorContext.Provider>
  );
};

export default RouteDetectorContextProvider;
