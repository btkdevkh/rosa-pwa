import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import UpdatePlotClient from "@/app/components/clients/observations/plots/UpdatePlotClient";

// Url "/observations/plots/updatePlot?uid=${UID}&nom=${NOM}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdatePlotPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <UpdatePlotClient />
    </Suspense>
  );
};

export default UpdatePlotPage;
