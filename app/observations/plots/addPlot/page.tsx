import React, { Suspense } from "react";
import Loading from "@/app/components/shared/Loading";
import AddPlotPageClient from "@/app/components/clients/observations/plots/AddPlotPageClient";

// Url "/observations/plots/addPlot"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AddPlotPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AddPlotPageClient />
    </Suspense>
  );
};

export default AddPlotPage;
