"use client";

import { useState } from "react";
import dataASC from "@/app/helpers/dataASC";
import useGetPlots from "@/app/hooks/plots/useGetPlots";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import CardPlot from "@/app/components/cards/plots/CardPlot";
import Loading from "@/app/components/shared/loaders/Loading";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import PlotsModalOptions from "@/app/components/modals/plots/PlotsModalOptions";
import StickyMenuBarWrapper from "@/app/components/shared/wrappers/StickyMenuBarWrapper";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";

const PlotsClient = () => {
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;

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
    if (!acc.some((plot) => plot.id === curr.id)) {
      acc.push(curr);
    }
    return acc;
  }, [] as Parcelle[]);

  const plotsNonArchived = uniquePlots
    ? uniquePlots.filter((plot) => !plot.est_archive)
    : [];
  const plotsArchived = uniquePlots
    ? uniquePlots.filter((plot) => plot.est_archive)
    : [];
  const plotsArchivedArray: Parcelle[] = showArchivedPlots ? plotsArchived : [];

  const plots = dataASC(
    [...plotsNonArchived, ...plotsArchivedArray],
    "nom"
  ).filter((d) =>
    query && !d.nom.toLowerCase().includes(query.toLowerCase()) ? false : true
  );

  const allPlotsAreArchived =
    plots.length > 0 ? plots.every((plot) => plot.est_archive) : false;

  return (
    <PageWrapper pageTitle="Rosa | Parcelles" navBarTitle="Parcelles">
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
                pathUrls={[
                  `${MenuUrlPath.OBSERVATIONS}/plots/addPlot?${explQueries}`,
                ]}
                setShowArchivedPlots={setShowArchivedPlots}
              />
            </ModalWrapper>
          )}
        </StickyMenuBarWrapper>

        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            {/* Loading */}
            {loading && <Loading />}

            {/* Aucune donnée */}
            {!success && !plotData && (
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
              plots.map((plot) => (
                <CardPlot
                  key={plot.id}
                  plot={plot}
                  rosiers={rosierData}
                  observations={observationData}
                  pathUrls={[
                    `${MenuUrlPath.OBSERVATIONS}/plots/plot?${explQueries}&plotID=${plot.id}&plotName=${plot.nom}&archived=${plot.est_archive}`,
                  ]}
                />
              ))}
          </div>
        </div>
      </>
    </PageWrapper>
  );
};

export default PlotsClient;
