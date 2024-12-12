import React, { Suspense } from "react";
import PlotsPageClient from "@/app/components/clients/observations/plots/PlotsPageClient";
import Loading from "../components/Loading";

// Url "/observations"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ObservationPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PlotsPageClient plotData={[]} />
    </Suspense>
  );
};

export default ObservationPage;
