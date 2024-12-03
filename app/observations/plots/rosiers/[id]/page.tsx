import React, { Suspense } from "react";
import Loading from "@/app/components/Loading";
import IdRosierPageClient from "@/app/components/clients/observations/rosiers/IdRosierPageClient";

// Url : "/observations/plots/rosiers/rosier?uid=${UID}&nom=${NOM}&plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component
// that use to fetch "data" from a server
// and pass "data" to the client side component.
const IdRosierPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <IdRosierPageClient />
    </Suspense>
  );
};

export default IdRosierPage;
