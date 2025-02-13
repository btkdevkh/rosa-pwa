"use client";

import React, { ReactNode, use, useEffect, useState } from "react";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import CardPlot from "@/app/components/cards/plots/CardPlot";
import dataASC from "@/app/helpers/dataASC";
import PlotsModalOptions from "@/app/components/modals/plots/PlotsModalOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import StickyMenuBarWrapper from "@/app/components/shared/wrappers/StickyMenuBarWrapper";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { Rosier } from "@/app/models/interfaces/Rosier";
import { Observation } from "@/app/models/interfaces/Observation";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import { ExploitationContext } from "@/app/context/ExploitationContext";

type PlotsClientProps = {
  plots: Parcelle[] | null;
  rosiers: Rosier[] | null;
  observations: Observation[] | null;
  children?: ReactNode;
};

const PlotsClient = ({
  plots: plotData,
  rosiers: rosierData,
  observations: observationData,
  children,
}: PlotsClientProps) => {
  const router = useRouter();
  const { selectedExploitationOption } = use(ExploitationContext);

  const [query, setQuery] = useState("");
  const [showArchivedPlots, setShowArchivedPlots] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Unique plots array
  const uniquePlots = plotData?.reduce((acc, curr) => {
    if (!acc.some(plot => plot.id === curr.id)) {
      acc.push(curr);
    }
    return acc;
  }, [] as Parcelle[]);

  const plotsNonArchived = uniquePlots
    ? uniquePlots.filter(plot => !plot.est_archive)
    : [];
  const plotsArchived = uniquePlots
    ? uniquePlots.filter(plot => plot.est_archive)
    : [];
  const plotsArchivedArray: Parcelle[] = showArchivedPlots ? plotsArchived : [];

  const plots = dataASC(
    [...plotsNonArchived, ...plotsArchivedArray],
    "nom"
  ).filter(d =>
    query && !d.nom.toLowerCase().includes(query.toLowerCase()) ? false : true
  );

  const allPlotsAreArchived =
    plots.length > 0 ? plots.every(plot => plot.est_archive) : false;

  useEffect(() => {
    if (selectedExploitationOption) {
      router.replace(
        `${MenuUrlPath.OBSERVATIONS}?exploitationID=${selectedExploitationOption.id}`
      );
    }
  }, [router, selectedExploitationOption]);

  return (
    <PageWrapper pageTitle="Rospot | Parcelles" navBarTitle="Parcelles">
      <>
        <StickyMenuBarWrapper>
          {/* Search options top bar */}
          <SearchOptions
            query={query}
            setQuery={setQuery}
            setShowOptionsModal={setShowOptionsModal}
          />

          {/* Options Modal */}
          {showOptionsModal && (
            <ModalWrapper closeOptionModal={() => setShowOptionsModal(false)}>
              <PlotsModalOptions
                showArchivedPlots={showArchivedPlots}
                onClickAddPlot={() =>
                  router.push("/observations/plots/addPlot")
                }
                setShowArchivedPlots={setShowArchivedPlots}
              />
            </ModalWrapper>
          )}
        </StickyMenuBarWrapper>

        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            {/* Absent de données */}
            {!plotData ||
              (plotData && plotData.length === 0 && <>{children}</>)}

            {query !== "" &&
              plotData &&
              plotData.length > 0 &&
              plots &&
              plots.length === 0 && (
                <p className="text-center">
                  Il n&apos;existe pas de parcelle avec ce nom
                </p>
              )}

            {allPlotsAreArchived && (
              <p className="text-center">
                Toutes les parcelles sont archivées.
              </p>
            )}

            {/* Plots */}
            {plots &&
              plots.length > 0 &&
              plots.map(plot => (
                <CardPlot
                  key={plot.id}
                  plot={plot}
                  rosiers={rosierData}
                  observations={observationData}
                />
              ))}
          </div>
        </div>
      </>
    </PageWrapper>
  );
};

export default PlotsClient;
