import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import AddRosierPageClient from "@/app/components/clients/observations/rosiers/AddRosierPageClient";

// Url : "/observations/plots/rosiers/addRosier?plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AddRosierPage = () => {
  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <AddRosierPageClient />
    </Suspense>
  );
};

export default AddRosierPage;
