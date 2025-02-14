import { Suspense } from "react";
import SuspenseFallback from "../components/shared/SuspenseFallback";
import PlotsClient from "@/app/components/clients/observations/plots/PlotsClient";

// Url "/observations"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const ObservationPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <PlotsClient />
    </Suspense>
  );
};

export default ObservationPage;
