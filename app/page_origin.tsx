"use client";

import React from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import PageWrapper from "./components/PageWrapper";

const HomePage = () => {
  const { authenticatedUser } = useContext(AuthContext);

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
