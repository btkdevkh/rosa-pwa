import React, { Suspense } from "react";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import IdRosierPageClient from "@/app/components/clients/observations/rosiers/IdRosierPageClient";
import getObservations from "@/app/services/rosiers/observations/getObservations";

// Url : "/observations/plots/rosiers/rosier?uid=${UID}&nom=${NOM}&plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component
// that use to fetch "data" from a server
// and pass "data" to the client side component.
const IdRosierPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  if (!params || !params.rosierID) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <IdRosierPageClient observations={[]} />
      </Suspense>
    );
  }

  const response = await getObservations(+params.rosierID as number);
  const observationData = response?.data.observations;

  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <IdRosierPageClient observations={observationData || []} />
    </Suspense>
  );
};

export default IdRosierPage;
