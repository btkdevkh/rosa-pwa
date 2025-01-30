import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import IdPlotPageClient from "@/app/components/clients/observations/plots/IdPlotPageClient";
import getRosiers from "@/app/services/rosiers/getRosiers";
import { SearchParams } from "@/app/models/types/SearchParams";

// Url "/observations/plots/plot?uid=${UID}&nom=${NOM}"
// This page is a server component
// that use to fetch "data" from a server
// and pass "data" to the client side component.
const IdPlotPage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  if (!params || !params.plotID) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <IdPlotPageClient rosiers={[]} observations={[]} />;
      </Suspense>
    );
  }

  const response = await getRosiers(+params.plotID as number);
  const rosierData = response?.data.rosiers;
  const observationData = response?.data.observations;

  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <IdPlotPageClient rosiers={rosierData} observations={observationData} />;
    </Suspense>
  );
};

export default IdPlotPage;
