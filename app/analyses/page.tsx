import React, { Suspense } from "react";
import AnalysesClient from "../components/clients/analyses/AnalysesClient";
import SuspenseFallback from "../components/shared/SuspenseFallback";
import getWidgets from "@/app/actions/widgets/getWidgets";
import { SearchParams } from "../models/types/SearchParams";

// Url "/analyses?explID=${ID}&dasboardID=${ID}"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AnalysePage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  if (!params || !params.explID || !params.dasboardID) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <AnalysesClient widgets={[]} />
      </Suspense>
    );
  }

  const widgets = await getWidgets(+params.explID, +params.dasboardID);

  if (
    (widgets && !Array.isArray(widgets)) ||
    (widgets && Array.isArray(widgets) && widgets.length === 0)
  ) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <AnalysesClient
          widgets={[]}
          msg={
            <div className="text-center">
              <p>
                Aucun graphique enregistré. <br /> Pour créer un graphique,
                appuyez sur le bouton en haut à droite de l&apos;écran puis
                choisissez &quot;Créer un graphique&quot;.
              </p>
            </div>
          }
        />
      </Suspense>
    );
  }

  const sortedWidgets = widgets.sort(
    (a, b) => a.widget.params.index - b.widget.params.index
  );

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AnalysesClient widgets={sortedWidgets} />
    </Suspense>
  );
};

export default AnalysePage;
