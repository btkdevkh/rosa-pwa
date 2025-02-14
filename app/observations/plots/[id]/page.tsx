import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import IdPlotClient from "@/app/components/clients/observations/plots/idPlot/IdPlotClient";

// Url "/observations/plots/plot?plotID=${id}&plotName=${nom}"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const IdPlotPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <IdPlotClient />;
    </Suspense>
  );
};

export default IdPlotPage;
