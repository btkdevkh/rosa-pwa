import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import IdPlotPageClient from "@/app/components/clients/observations/plots/IdPlotPageClient";

// Url "/observations/plots/plot?uid=${UID}&nom=${NOM}"
// This page is a server component
// that use to fetch "data" from a server
// and pass "data" to the client side component.
const IdPlotPage = () => {
  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <IdPlotPageClient rosierData={[]} />;
    </Suspense>
  );
};

export default IdPlotPage;
