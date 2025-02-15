"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import firebase_app from "../firebase/config";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import RouteDetectorContextProvider from "./RouteDetectorContext";
import {
  getAuth,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import Loading from "../components/shared/loaders/Loading";

const auth = getAuth(firebase_app);

// Persiste auth user
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local");
  })
  .catch(error => {
    console.error("Error setting persistence:", error);
  });

const ExploitationContextProvider = dynamic(
  () => import("./ExploitationContext"),
  {
    ssr: false,
  }
);

type AuthContextDataType = {
  authenticatedUser: User | null;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const initialAuthContextData: AuthContextDataType = {
  authenticatedUser: null,
};

export const AuthContext = createContext(initialAuthContextData);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const pathname = usePathname();

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthContextDataType>({
      authenticatedUser: null,
    });
  const [loading, setLoading] = useState(true);

  // Auth state change
  useEffect(() => {
    const auth = getAuth(firebase_app);

    const unsub = onAuthStateChanged(
      auth,
      user => {
        // Disabled : Normaly, we use this TEST below to verify authenticated user, but we're already
        // used and préfered another solution method in the middleware of server in the root of the project
        //-------------------------------------------------------------------------------------------------
        // if (!user) {
        //   setLoading(false);
        //   setAuthenticatedUser({ authenticatedUser: null });
        //   if (pathname !== MenuUrlPath.OFFLINE) {
        //     router.push(MenuUrlPath.LOGIN);
        //   }
        //   return;
        // }

        setLoading(false);
        setAuthenticatedUser({ authenticatedUser: user });

        // Disabled : To preserve route when page has refreshed
        // Push to default route
        // if (pathname !== MenuUrlPath.OFFLINE) {
        //   router.push(MenuUrlPath.OBSERVATIONS);
        // }
      },
      err => {
        console.log("Error :", err);
        setAuthenticatedUser({ authenticatedUser: null });
        setLoading(false);
      }
    );

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    loading &&
    pathname === "/login" &&
    !authenticatedUser.authenticatedUser
  ) {
    return <Loading />;
  }

  return (
    <SessionProvider>
      <AuthContext.Provider value={authenticatedUser}>
        <RouteDetectorContextProvider>
          <ExploitationContextProvider>{children}</ExploitationContextProvider>
        </RouteDetectorContextProvider>
      </AuthContext.Provider>
    </SessionProvider>
  );
};

export default AuthContextProvider;
