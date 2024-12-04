import React, { Suspense } from "react";
import PlotsPageClient from "@/app/components/clients/observations/plots/PlotsPageClient";
import Loading from "../components/Loading";
import { parcelles } from "../data";

// Url "/observations"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ObservationPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PlotsPageClient plotData={[...parcelles]} />
    </Suspense>
  );
};

export default ObservationPage;
