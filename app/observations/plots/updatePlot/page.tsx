import { Suspense } from "react";
import Loading from "@/app/components/Loading";
import UpdatePlotPageClient from "@/app/components/clients/observations/plots/UpdatePlotPageClient";

// Url "/observations/plots/updatePlot?uid=${UID}&nom=${NOM}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdatePlotPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <UpdatePlotPageClient />
    </Suspense>
  );
};

export default UpdatePlotPage;
