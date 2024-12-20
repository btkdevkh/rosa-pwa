import React, { Suspense } from "react";
import PlotsPageClient from "@/app/components/clients/observations/plots/PlotsPageClient";
import FallbackPageWrapper from "../components/shared/FallbackPageWrapper";

// Url "/observations"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ObservationPage = async () => {
  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <PlotsPageClient />
    </Suspense>
  );
};

export default ObservationPage;
