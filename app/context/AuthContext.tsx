"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import firebase_app from "../firebase/config";
import Loader from "../components/Loader";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import MenuBar from "../components/MenuBar";

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

  // Pathname in FR
  const pathnameFR = {
    pathname:
      pathname === "/settings"
        ? "Paramètres"
        : pathname === "/observations"
        ? "Observations"
        : pathname === "/analyses"
        ? "Analyses"
        : pathname === "/resetPassword"
        ? "Mot de passe oublié"
        : pathname === "/offline"
        ? "Vous êtes hors ligne"
        : "",
  };

  if (loading) {
    if (pathname === "/login") {
      return (
        <div className="py-48">
          <Loader />
        </div>
      );
    }

    if (authenticatedUser.authenticatedUser) {
      return (
        // h-screen flex justify-center items-center
        <div className="flex flex-col h-screen">
          <Navbar title={pathnameFR.pathname} back={true} />
          <div className="py-48">
            <Loader />
          </div>

          {/* Bottom Menu bar */}
          {pathname !== "/resetPassword" && pathname !== "/offline" && (
            <div className="mt-auto">
              <MenuBar />
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <>
      <AuthContext.Provider value={authenticatedUser}>
        <ExploitationContextProvider>{children}</ExploitationContextProvider>
      </AuthContext.Provider>
    </>
  );
};

export default AuthContextProvider;
