import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import UpdateRosierClient from "@/app/components/clients/observations/rosiers/updateRosier/UpdateRosierClient";

// Url : "/observations/plots/rosiers/updateRosier?uid=${UID}&nom=${NOM}&plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const UpdateRosierPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <UpdateRosierClient />
    </Suspense>
  );
};

export default UpdateRosierPage;
