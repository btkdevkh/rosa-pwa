import { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import UpdatePlotPageClient from "@/app/components/clients/observations/plots/UpdatePlotPageClient";

// Url "/observations/plots/updatePlot?uid=${UID}&nom=${NOM}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdatePlotPage = () => {
  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <UpdatePlotPageClient />
    </Suspense>
  );
};

export default UpdatePlotPage;
