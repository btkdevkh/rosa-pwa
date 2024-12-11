import React, { Suspense } from "react";
import { OptionType } from "../components/selects/SingleSelect";
import Loading from "../components/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";
import { Exploitation } from "../models/interfaces/Exploitation";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/authOptions";
import { API_PATH } from "@/app/https/API_PATH";

// Url "/settings"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const SettingPage = async () => {
  const session = await getServerSession(authOptions);
  console.log("session :", session);

  const exploitations: Exploitation[] | null = await getExploitations(
    session?.user?.name
  );

  const exploitationOptions = exploitations?.map(exploitation => ({
    id: exploitation.id,
    value: exploitation.nom,
    label: exploitation.nom,
  }));

  const userExploitations: OptionType[] = exploitationOptions ?? [];

  return (
    <Suspense fallback={<Loading />}>
      <SettingPageClient exploitations={userExploitations} />
    </Suspense>
  );
};

export default SettingPage;

const getExploitations = async (
  userUID?: string | null
): Promise<Exploitation[] | null> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXTAUTH_URL ||
        "https://rospot-dev-528742997345.europe-west1.run.app/"
      }/${API_PATH.exploitations}?userUID=${userUID}`
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    return null;
  } catch (error) {
    console.log("error :", error);
    return null;
  }
};
