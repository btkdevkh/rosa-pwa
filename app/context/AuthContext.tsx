"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import firebase_app from "../firebase/config";
import Loader from "../components/Loader";
import { usePathname, useRouter } from "next/navigation";

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
          return;
        }

        setLoading(false);
        setAuthenticatedUser({ authenticatedUser: user });
      },
      err => {
        console.log("Error :", err);
        setAuthenticatedUser({ authenticatedUser: null });
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  console.log(pathname);

  // Redirect not authenticated user to "/login"
  useEffect(() => {
    if (!authenticatedUser.authenticatedUser) {
      return router.push("/login");
    }

    return router.push("/");
  }, [authenticatedUser, router]);

  if (loading) {
    return (
      // h-screen flex justify-center items-center
      <div className="py-3">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <AuthContext.Provider value={authenticatedUser}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContextProvider;
