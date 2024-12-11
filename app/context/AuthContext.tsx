"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import firebase_app from "../firebase/config";
import { usePathname, useRouter } from "next/navigation";
import RouteDetectorContextProvider from "./RouteDetectorContext";
import { SessionProvider } from "next-auth/react";
import Loading from "../components/Loading";

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
          router.push("/settings");
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
    if (pathnames.includes(pathname)) {
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

const pathnames = ["/login", "/settings"];
