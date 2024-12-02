"use client";

import React from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import PageWrapper from "./components/PageWrapper";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const { data: session } = useSession();
  console.log("session :", session);

  return (
    <>
      {authenticatedUser && (
        <PageWrapper pageTitle="Rospot | Accueil" navBarTitle="Accueil">
          <></>
        </PageWrapper>
      )}
    </>
  );
};

export default HomePage;
