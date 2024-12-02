"use client";

import React, { useContext, useState } from "react";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import SearchOptions from "../components/searchs/SearchOptions";
import CardPlot from "../components/cards/plots/CardPlot";
import { Plot } from "../models/interfaces/Plot";
import dataASC from "../helpers/dataASC";
import PlotsModalOptions from "../components/modals/plots/PlotsModalOptions";
import ModalWrapper from "../components/modals/ModalWrapper";
import { useRouter } from "next/navigation";
import PageWrapper from "../components/PageWrapper";

const ObservationPage = () => {
  const router = useRouter();
  const { selectedExploitationOption } = useContext(ExploitationContext);
  const [query, setQuery] = useState("");
  const [showArchivedPlots, setShowArchivedPlots] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const plotsByExploitation = parcelles.filter(
    plot => plot.map_expl?.uid === selectedExploitationOption?.uid
  );

  const areAllPlotsArchived = parcelles.every(plot => plot.archived);

  const plotsNonArchived = plotsByExploitation.filter(plot => !plot.archived);
  const plotsArchived = plotsByExploitation.filter(plot => plot.archived);
  const plotsArchivedArray = showArchivedPlots ? plotsArchived : [];

  const plots = dataASC(
    [...plotsNonArchived, ...plotsArchivedArray],
    "nom"
  ).filter(d =>
    query && !d.nom.toLowerCase().includes(query.toLowerCase()) ? false : true
  );

  // console.log("selectedExploitationOption :", selectedExploitationOption);
  // console.log("query :", query);
  // console.log("plots :", plots);

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

export default ObservationPage;

// Fake data
export const parcelles: Plot[] = [
  {
    uid: "p1",
    nom: "Parcelle B",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r1", nom: "Rosier A1", archived: false },
    delayPassed: true,
    archived: false,
  },
  {
    uid: "p3",
    nom: "TNT",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r2", nom: "Rosier A2", archived: true },
    delayPassed: true,
    archived: true,
  },
  {
    uid: "p2",
    nom: "Parcelle A",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r3", nom: "Rosier A3", archived: true },
    delayPassed: true,
    archived: false,
  },
];
