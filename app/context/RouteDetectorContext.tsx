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

    if (window && previousPathname.current !== pathname) {
      setRouteHasChanged(true);

      // console.log(previousPathname.current);
      // console.log(pathname);

      // Extract url params from href
      const params = window.location.href.split("?")[1];

      // Update the previous path
      if (params) {
        previousPathname.current = `${pathname}?${params}`;
      } else {
        previousPathname.current = pathname;
      }
    }
  }, [pathname]);

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
