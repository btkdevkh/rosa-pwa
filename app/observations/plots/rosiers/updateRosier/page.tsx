import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import UpdateRosierPageClient from "@/app/components/clients/observations/rosiers/UpdateRosierPageClient";

// Url : "/observations/plots/rosiers/updateRosier?uid=${UID}&nom=${NOM}&plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdateRosierPage = () => {
  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <UpdateRosierPageClient />
    </Suspense>
  );
};

export default UpdateRosierPage;
