import React, { Suspense } from "react";
import { OptionType } from "../components/selects/SingleSelect";
import Loading from "../components/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";
import { Exploitation } from "../models/interfaces/Exploitation";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/authOptions";
import { API_PATH } from "@/app/https/API_PATH";
import { redirect } from "next/navigation";

// Url "/settings"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const SettingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const exploitations: Exploitation[] | null = await getExploitations(
    session?.user?.name
  );

  if (!exploitations) {
    return (
      <Suspense fallback={<Loading />}>
        <h1>Vous ne possédez aucune exploitation</h1>
      </Suspense>
    );
  }

  const exploitationOptions = exploitations.map(exploitation => ({
    id: exploitation.id,
    value: exploitation.nom,
    label: exploitation.nom,
  }));

  const userExploitations: OptionType[] = exploitationOptions;
  console.log("userExploitations :", userExploitations);

  return (
    <Suspense fallback={<Loading />}>
      <SettingPageClient exploitations={userExploitations} />
    </Suspense>
  );
};

export default SettingPage;

const getExploitations = async (
  userUDI?: string | null
): Promise<Exploitation[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/${API_PATH.exploitations}?userUDI=${userUDI}`
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
