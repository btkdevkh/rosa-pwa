"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import firebase_app from "../firebase/config";
import Loader from "../components/Loader";
import { usePathname, useRouter } from "next/navigation";
import RouteDetectorContextProvider from "./RouteDetectorContext";

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
    const unsub = onAuthStateChanged(
      getAuth(firebase_app),
      user => {
        if (!user) {
          setLoading(false);
          setAuthenticatedUser({ authenticatedUser: null });
          if (pathname !== "/offline") {
            router.push("/login");
          }
          return;
        }

        setLoading(false);
        setAuthenticatedUser({ authenticatedUser: user });
        if (pathname !== "/offline") {
          router.push("/");
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
    if (pathname === "/login") {
      return (
        <div className="flex flex-col items-center gap-3 py-48">
          <span>Chargement en cours</span>
          <Loader />
        </div>
      );
    }
  }

  return (
    <>
      <AuthContext.Provider value={authenticatedUser}>
        <RouteDetectorContextProvider>
          <ExploitationContextProvider>{children}</ExploitationContextProvider>
        </RouteDetectorContextProvider>
      </AuthContext.Provider>
    </>
  );
};

export default AuthContextProvider;

// Pathname in FR
// const pathnameFR = {
//   pathname:
//     pathname === "/settings"
//       ? "Paramètres"
//       : pathname === "/observations"
//       ? "Observations"
//       : pathname === "/analyses"
//       ? "Analyses"
//       : pathname === "/resetPassword"
//       ? "Mot de passe oublié"
//       : pathname === "/offline"
//       ? "Vous êtes hors ligne"
//       : "",
// };
