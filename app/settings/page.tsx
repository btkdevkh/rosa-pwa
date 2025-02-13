import { Suspense } from "react";
import SettingClient from "../components/clients/settings/SettingClient";
import SuspenseFallback from "../components/shared/SuspenseFallback";

// Url "/settings"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const SettingPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <SettingClient />
    </Suspense>
  );
};

export default SettingPage;
