import React, { Suspense } from "react";
import AnalysesClient from "../components/clients/analyses/AnalysesClient";
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
        <AnalysesClient widgets={[]} />
      </Suspense>
    );
  }

  const widgets = await getWidgets(+params.explID, +params.dasboardID);

  if (
    (widgets && "success" in widgets && !widgets.success) ||
    (widgets && !Array.isArray(widgets))
  ) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <AnalysesClient widgets={[]} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <AnalysesClient
        widgets={widgets.sort(
          (a, b) => a.widget.params.index - b.widget.params.index
        )}
      />
    </Suspense>
  );
};

export default AnalysePage;
