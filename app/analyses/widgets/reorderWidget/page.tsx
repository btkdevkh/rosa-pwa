import React, { Suspense } from "react";
import { Widget } from "@/app/models/interfaces/Widget";
import { SearchParams } from "@/app/models/types/SearchParams";
import getOnlyWidgets from "@/app/actions/widgets/getOnlyWidgets";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import ReorderWidgetClient from "@/app/components/clients/analyses/widgets/reorderWidget/ReorderWidgetClient";

// Url "/analyses/widgets/reorderWidget?dashboardID=${ID}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ReorderWidgetPage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  if (!params || !params.dashboardID) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <ReorderWidgetClient widgets={null} />
      </Suspense>
    );
  }

  // Fetch data
  const response = await getOnlyWidgets(+params.dashboardID);

  if (response && !response.success) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <ReorderWidgetClient widgets={null} />
      </Suspense>
    );
  }
  const { widgets } = response;

  const sortedWidgets = (widgets as Widget[]).sort(
    (a, b) => a.params.index - b.params.index
  );

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ReorderWidgetClient widgets={sortedWidgets} />
    </Suspense>
  );
};

export default ReorderWidgetPage;
