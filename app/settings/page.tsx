import React, { Suspense } from "react";
import { OptionType } from "../components/selects/SingleSelect";
import { exploitationOptions } from "../data";
import Loading from "../components/Loading";
import SettingPageClient from "../components/clients/settings/SettingPageClient";

// Url "/settings"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const SettingPage = async () => {
  try {
    const response = await fetch(`http://localhost:8181/api/explotations`);
    console.log("response :", response);
  } catch (error) {
    console.log("error :", error);
  }

  return (
    <Suspense fallback={<Loading />}>
      <SettingPageClient exploitations={userExploitations} />
    </Suspense>
  );
};

export default SettingPage;

// Fake data
const userExploitations: OptionType[] = exploitationOptions;
