import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import AddRosierClient from "@/app/components/clients/observations/rosiers/addRosier/AddRosierClient";

// Url : "/observations/plots/rosiers/addRosier?plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const AddRosierPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AddRosierClient />
    </Suspense>
  );
};

export default AddRosierPage;
