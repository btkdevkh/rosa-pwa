import React, { Suspense } from "react";
import getPlots from "../services/plots/getPlots";
import SuspenseFallback from "../components/shared/SuspenseFallback";
import PlotsClient from "@/app/components/clients/observations/plots/PlotsClient";
import { SearchParams } from "../models/types/SearchParams";

// Url "/observations"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const ObservationPage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  if (!params || !params.exploitationID) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <PlotsClient plots={[]} rosiers={[]} observations={[]} />
      </Suspense>
    );
  }

  const response = await getPlots(+params.exploitationID, false);

  if (!response || (response && response.status !== 200)) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <PlotsClient plots={[]} rosiers={[]} observations={[]}>
          <p className="text-center">
            Aucune parcelle enregistrée. <br /> Pour créer une parcelle, appuyez
            sur le bouton en haut à droite de l&apos;écran puis choisissez
            &quot;Créer une parcelle&quot;.
          </p>
        </PlotsClient>
      </Suspense>
    );
  }

  const plotData = response.data.plots;
  const rosierData = response.data.rosiers;
  const observationData = response.data.observations;

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <PlotsClient
        plots={plotData}
        rosiers={rosierData}
        observations={observationData}
      />
    </Suspense>
  );
};

export default ObservationPage;
