import React, { Suspense } from "react";
import { OptionType } from "../components/selects/SingleSelect";
import Loading from "../components/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";
import { Exploitation } from "../models/interfaces/Exploitation";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/authOptions";

// Url "/settings"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const SettingPage = async () => {
  const session = await getServerSession(authOptions);
  console.log("session :", session);

  const exploitations = await getExploitations(session?.user?.name);

  const exploitationOptions = exploitations?.map((expl: Exploitation) => ({
    id: expl.id,
    value: expl.nom,
    label: expl.nom,
  }));

  const userExploitations: OptionType[] = exploitationOptions ?? [];

  return (
    <Suspense fallback={<Loading />}>
      <SettingPageClient exploitations={userExploitations} />
    </Suspense>
  );
};

export default SettingPage;

const getExploitations = async (userUID?: string | null) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/exploitations?userUID=${userUID}`
    );

    if (!response.ok) {
      throw new Error("Data fetching failed");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
