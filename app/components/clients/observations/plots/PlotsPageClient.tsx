"use client";

import React, { useContext, useState } from "react";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import CardPlot from "@/app/components/cards/plots/CardPlot";
import dataASC from "@/app/helpers/dataASC";
import PlotsModalOptions from "@/app/components/modals/plots/PlotsModalOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/components/shared/PageWrapper";
import StickyMenuBarWrapper from "@/app/components/shared/StickyMenuBarWrapper";
import usePlots from "@/app/hooks/plots/usePlots";
import Loading from "@/app/components/shared/Loading";
import { Parcelle } from "@/app/models/interfaces/Parcelle";

const PlotsPageClient = () => {
  const router = useRouter();
  const { selectedExploitationOption } = useContext(ExploitationContext);
  const { loading, plots: plotData } = usePlots(selectedExploitationOption?.id);

  const [query, setQuery] = useState("");
  const [showArchivedPlots, setShowArchivedPlots] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const plotsNonArchived = plotData
    ? plotData.filter(plot => !plot.est_archive)
    : [];
  const plotsArchived = plotData
    ? plotData.filter(plot => plot.est_archive)
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

  // console.log("plotData :", plotData);
  // console.log("selectedExploitationOption :", selectedExploitationOption);
  // console.log("allPlotsAreArchived :", allPlotsAreArchived);

  if (loading) {
    return <Loading />;
  }

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
            {plots.length === 0 && (
              <p className="text-center">Aucune parcelle enregistrée.</p>
            )}

            {allPlotsAreArchived && (
              <p className="text-center">
                Toutes les parcelles sont archivées.
              </p>
            )}

            {/* Plots */}
            {plots &&
              plots.length > 0 &&
              plots.map(plot => <CardPlot key={plot.id} plot={plot} />)}
          </div>
        </div>
      </>
    </PageWrapper>
  );
};

export default PlotsPageClient;
