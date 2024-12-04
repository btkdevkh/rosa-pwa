import React, { Suspense } from "react";
import IdPlotPageClient from "@/app/components/clients/observations/plots/IdPlotPageClient";
import Loading from "@/app/components/Loading";
import { rosiersFake } from "@/app/data";

// Url "/observations/plots/plot?uid=${UID}&nom=${NOM}"
// This page is a server component
// that use to fetch "data" from a server
// and pass "data" to the client side component.
const IdPlotPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <IdPlotPageClient rosierData={[...rosiersFake]} />;
    </Suspense>
  );
};

export default IdPlotPage;
