import React, { Suspense } from "react";
import Loading from "@/app/components/shared/Loading";
import UpdateRosierPageClient from "@/app/components/clients/observations/rosiers/UpdateRosierPageClient";

// Url : "/observations/plots/rosiers/updateRosier?uid=${UID}&nom=${NOM}&plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdateRosierPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <UpdateRosierPageClient />
    </Suspense>
  );
};

export default UpdateRosierPage;
