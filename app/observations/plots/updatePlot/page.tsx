import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import UpdatePlotClient from "@/app/components/clients/observations/plots/updatePlot/UpdatePlotClient";

// Url "/observations/plots/updatePlot?uid=${UID}&nom=${NOM}"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const UpdatePlotPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <UpdatePlotClient />
    </Suspense>
  );
};

export default UpdatePlotPage;
