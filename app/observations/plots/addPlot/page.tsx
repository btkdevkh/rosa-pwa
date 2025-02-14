import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import AddPlotClient from "@/app/components/clients/observations/plots/addPlot/AddPlotClient";

// Url "/observations/plots/addPlot"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const AddPlotPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AddPlotClient />
    </Suspense>
  );
};

export default AddPlotPage;
