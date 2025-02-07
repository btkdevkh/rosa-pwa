import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import UpdateRosierClient from "@/app/components/clients/observations/rosiers/UpdateRosierClient";
import getRosiers from "@/app/services/rosiers/getRosiers";
import { SearchParams } from "@/app/models/types/SearchParams";

// Url : "/observations/plots/rosiers/updateRosier?uid=${UID}&nom=${NOM}&plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdateRosierPage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  if (!params || !params.plotID) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <UpdateRosierClient rosiers={[]} />
      </Suspense>
    );
  }

  const response = await getRosiers(+params.plotID as number);
  const rosierData = response?.data.rosiers;

  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <UpdateRosierClient rosiers={rosierData || []} />
    </Suspense>
  );
};

export default UpdateRosierPage;
