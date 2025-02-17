"use client";

import { use, useState } from "react";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import CardPlot from "@/app/components/cards/plots/CardPlot";
import dataASC from "@/app/helpers/dataASC";
import PlotsModalOptions from "@/app/components/modals/plots/PlotsModalOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import StickyMenuBarWrapper from "@/app/components/shared/wrappers/StickyMenuBarWrapper";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import useGetPlots from "@/app/hooks/plots/useGetPlots";
import Loading from "@/app/components/shared/loaders/Loading";

const PlotsClient = () => {
  const { selectedExploitationOption } = use(ExploitationContext);
  const explID = selectedExploitationOption?.id;
  const {
    success,
    loading,
    plots: plotData,
    rosiers: rosierData,
    observations: observationData,
  } = useGetPlots(explID, false);

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
                pathUrls={["/observations/plots/addPlot"]}
                setShowArchivedPlots={setShowArchivedPlots}
              />
            </ModalWrapper>
          )}
        </StickyMenuBarWrapper>

        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            {/* Loading */}
            {loading && <Loading />}

            {/* Error */}
            {!success && !plotData && (
              <div className="text-center">
                <p>Problèmes techniques, Veuillez revenez plus tard, Merci!</p>
              </div>
            )}

            {/* Aucune donnée */}
            {success && plotData && plotData.length === 0 && (
              <p className="text-center">
                Aucune parcelle enregistrée. <br /> Pour créer une parcelle,
                appuyez sur le bouton en haut à droite de l&apos;écran puis
                choisissez &quot;Créer une parcelle&quot;.{" "}
              </p>
            )}

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
