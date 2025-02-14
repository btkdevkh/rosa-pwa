import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import IdRosierClient from "@/app/components/clients/observations/rosiers/idRosier/IdRosierClient";

// Url : "/observations/plots/rosiers/rosier?rosierID=${ID}&rosierName=${nom}&plotID=${ID}&plotName=${nom}&archived=${boolean}"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const IdRosierPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <IdRosierClient />
    </Suspense>
  );
};

export default IdRosierPage;
