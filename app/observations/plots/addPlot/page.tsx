import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import AddPlotClient from "@/app/components/clients/observations/plots/AddPlotClient";

// Url "/observations/plots/addPlot"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AddPlotPage = () => {
  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <AddPlotClient />
    </Suspense>
  );
};

export default AddPlotPage;
