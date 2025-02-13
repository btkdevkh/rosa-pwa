import React, { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import AddPlotClient from "@/app/components/clients/observations/plots/AddPlotClient";

// Url "/observations/plots/addPlot"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AddPlotPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AddPlotClient />
    </Suspense>
  );
};

export default AddPlotPage;
