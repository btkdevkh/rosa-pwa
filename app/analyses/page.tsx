import React, { Suspense } from "react";
import AnalysesPageClient from "../components/clients/analyses/AnalysesPageClient";
import FallbackPageWrapper from "../components/shared/FallbackPageWrapper";

// Url "/analyses"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AnalysePage = async () => {
  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <AnalysesPageClient />
    </Suspense>
  );
};

export default AnalysePage;
