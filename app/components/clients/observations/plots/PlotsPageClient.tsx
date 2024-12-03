"use client";

import React, { useContext, useState } from "react";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import CardPlot from "@/app/components/cards/plots/CardPlot";
import { Plot } from "@/app/models/interfaces/Plot";
import dataASC from "@/app/helpers/dataASC";
import PlotsModalOptions from "@/app/components/modals/plots/PlotsModalOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/components/PageWrapper";

type PlotsPageClientProps = {
  plotData: Plot[];
};

const PlotsPageClient = ({ plotData }: PlotsPageClientProps) => {
  const router = useRouter();
  const { selectedExploitationOption } = useContext(ExploitationContext);
  const [query, setQuery] = useState("");
  const [showArchivedPlots, setShowArchivedPlots] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const plotsByExploitation = plotData.filter(
    plot => plot.map_expl?.uid === selectedExploitationOption?.uid
  );

  const areAllPlotsArchived = plotData.every(plot => plot.archived);

  const plotsNonArchived = plotsByExploitation.filter(plot => !plot.archived);
  const plotsArchived = plotsByExploitation.filter(plot => plot.archived);
  const plotsArchivedArray = showArchivedPlots ? plotsArchived : [];

  const plots = dataASC(
    [...plotsNonArchived, ...plotsArchivedArray],
    "nom"
  ).filter(d =>
    query && !d.nom.toLowerCase().includes(query.toLowerCase()) ? false : true
  );

  return (
    <PageWrapper pageTitle="Rospot | Parcelles" navBarTitle="Parcelles">
      <>
        <div>
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
        </div>

        <div className="container mx-auto">
          {/* Plots */}
          <div className="flex flex-col gap-4">
            {plots.length === 0 && !areAllPlotsArchived && (
              <p className="text-center">Aucune parcelle enregistrée.</p>
            )}

            {plots.length === 0 && areAllPlotsArchived && (
              <p className="text-center">
                Toutes les parcelles sont archivées.
              </p>
            )}

            {plots &&
              plots.length > 0 &&
              plots.map(plot => <CardPlot key={plot.uid} plot={plot} />)}
          </div>
        </div>
      </>
    </PageWrapper>
  );
};

export default PlotsPageClient;
