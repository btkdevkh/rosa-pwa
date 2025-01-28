import React from "react";
import AnalysesPageClient from "../components/clients/analyses/AnalysesPageClient";

// Url "/analyses"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AnalysePage = () => {
  return (
    <>
      <AnalysesPageClient graphiqueData={[]} />
    </>
  );
};

export default AnalysePage;
