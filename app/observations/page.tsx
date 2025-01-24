import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/authOptions";
import getPlots from "../services/plots/getPlots";
import FallbackPageWrapper from "../components/shared/FallbackPageWrapper";
import PlotsPageClient from "@/app/components/clients/observations/plots/PlotsPageClient";

// Url "/observations"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ObservationPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session || !params || !params.exploitationID) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <PlotsPageClient plots={[]} rosiers={[]} observations={[]} />
      </Suspense>
    );
  }

  const response = await getPlots(+params.exploitationID, false);

  if (!response || (response && response.status !== 200)) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <PlotsPageClient plots={[]} rosiers={[]} observations={[]}>
          <p className="text-center">
            Aucune parcelle enregistrée. <br /> Pour créer une parcelle, appuyez
            sur le bouton en haut à droite de l&apos;écran puis choisissez
            &quot;Créer une parcelle&quot;.
          </p>
        </PlotsPageClient>
      </Suspense>
    );
  }

  const plotData = response.data.plots;
  const rosierData = response.data.rosiers;
  const observationData = response.data.observations;

  return (
    <Suspense fallback={<FallbackPageWrapper />}>
      <PlotsPageClient
        plots={plotData}
        rosiers={rosierData}
        observations={observationData}
      />
    </Suspense>
  );
};

export default ObservationPage;
