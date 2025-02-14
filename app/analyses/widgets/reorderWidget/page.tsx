import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import ReorderWidgetClient from "@/app/components/clients/analyses/widgets/reorderWidget/ReorderWidgetClient";

// Url "/analyses/widgets/reorderWidget?dashboardID=${ID}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ReorderWidgetPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ReorderWidgetClient />
    </Suspense>
  );
};

export default ReorderWidgetPage;
