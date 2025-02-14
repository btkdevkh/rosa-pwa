import React, { Suspense } from "react";
import AnalysesClient from "../components/clients/analyses/AnalysesClient";
import SuspenseFallback from "../components/shared/SuspenseFallback";

// Url "/analyses"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const AnalysePage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AnalysesClient />
    </Suspense>
  );
};

export default AnalysePage;
