import { Suspense } from "react";
import SettingClient from "../components/clients/settings/SettingClient";
import SuspenseFallback from "../components/shared/SuspenseFallback";

// Url "/settings"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const SettingPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <SettingClient />
    </Suspense>
  );
};

export default SettingPage;
