import { getServerSession } from "next-auth";
import authOptions from "./api/auth/authOptions";
import { redirect } from "next/navigation";
import { MenuUrlPath } from "./models/enums/MenuUrlPathEnum";

// Url "/"
// This page is a "Home/Accueil" server component
// there's no sub component here (return null to rendering)
// can be tranformed to a client component when needed (see example below)
const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(MenuUrlPath.ANALYSES);
  }

  return null;
};

export default HomePage;

/*
"use client"

import React from "react";
import PageWrapper from "./components/shared/PageWrapper";

// Url "/"
// client component
const HomePage = () => {
  return (
    <PageWrapper pageTitle="Rospot | Accueil" navBarTitle="Accueil">
      <></>
    </PageWrapper>
  );
};

export default HomePage;
*/
