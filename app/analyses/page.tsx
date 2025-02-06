import React, { Suspense } from "react";
import AnalysesPageClient from "../components/clients/analyses/AnalysesPageClient";
import FallbackPageWrapper from "../components/shared/FallbackPageWrapper";
import getWidgets from "@/app/actions/widgets/getWidgets";
import { SearchParams } from "../models/types/SearchParams";

// Url "/analyses?explID=${ID}&dasboardID=${ID}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AnalysePage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  if (!params || !params.explID || !params.dasboardID) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <AnalysesPageClient widgets={[]} />
      </Suspense>
    );
  }

  const widgetGraphique = await getWidgets(+params.explID, +params.dasboardID);

  if (!Array.isArray(widgetGraphique)) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <AnalysesPageClient widgets={[]} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <AnalysesPageClient widgets={widgetGraphique} />
    </Suspense>
  );
};

export default AnalysePage;
