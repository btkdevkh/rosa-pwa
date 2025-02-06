import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import { SearchParams } from "next/dist/server/request/search-params";

// Url "/analyses/widgets/reorderWidget"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ReorderWidgetPage = async ({ searchParams }: SearchParams) => {
  console.log(searchParams);

  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <>Hi</>
    </Suspense>
  );
};

export default ReorderWidgetPage;
