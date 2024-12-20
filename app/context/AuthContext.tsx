"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getAuth,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import firebase_app from "../firebase/config";
import { usePathname, useRouter } from "next/navigation";
import RouteDetectorContextProvider from "./RouteDetectorContext";
import { SessionProvider } from "next-auth/react";
import Loading from "../components/shared/Loading";
import { MenuUrlPath } from "../models/enums/MenuUrlPathEnum";

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
  const router = useRouter();
  const pathname = usePathname();

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthContextDataType>({
      authenticatedUser: null,
    });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebase_app);

    const unsub = onAuthStateChanged(
      auth,
      user => {
        if (!user) {
          setLoading(false);
          setAuthenticatedUser({ authenticatedUser: null });
          if (pathname !== MenuUrlPath.OFFLINE) {
            router.push(MenuUrlPath.LOGIN);
          }
          return;
        }

        setLoading(false);
        setAuthenticatedUser({ authenticatedUser: user });
        if (pathname !== MenuUrlPath.OFFLINE) {
          router.push(MenuUrlPath.OBSERVATIONS);
        }
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

  if (loading) {
    if (pathnames.includes(pathname) && !authenticatedUser.authenticatedUser) {
      return <Loading />;
    }
  }

  return (
    <>
      <SessionProvider>
        <AuthContext.Provider value={authenticatedUser}>
          <RouteDetectorContextProvider>
            <ExploitationContextProvider>
              {children}
            </ExploitationContextProvider>
          </RouteDetectorContextProvider>
        </AuthContext.Provider>
      </SessionProvider>
    </>
  );
};

export default AuthContextProvider;

const pathnames: string[] = ["/login", "/settings"];
