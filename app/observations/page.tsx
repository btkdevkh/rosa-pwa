"use client";

import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import MenuBar from "../components/MenuBar";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import SearchOptions from "../components/searchs/SearchOptions";
import CardPlot from "../components/cards/CardPlot";
import { Plot } from "../models/interfaces/Plot";
import dataASC from "../helpers/dataASC";

const ObservationPage = () => {
  const { selectedExploitationOption } = useContext(ExploitationContext);
  const [query, setQuery] = useState("");
  const [showArchivedPlots, setShowArchivedPlots] = useState(false);
  const [showBadgeActionCard, setShowBadgeActionCard] = useState(false);

  const plotsByExploitation = parcelles.filter(
    plot => plot.map_expl?.uid === selectedExploitationOption?.uid
  );

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
    <>
      <title>Rospot | Parcelles</title>
      <div className="flex flex-col h-screen">
        {/* Top Nav bar */}
        <Navbar title="Parcelles" back={false} />

        {/* Search options */}
        <SearchOptions
          query={query}
          setQuery={setQuery}
          setShowBadgeActionCard={setShowBadgeActionCard}
        />

        <div
          className="container mx-auto"
          onClick={() => setShowBadgeActionCard(false)}
        >
          {/* Badge actions card */}
          {showBadgeActionCard && (
            <div className="card bg-base-100 w-full shadow-md">
              <div className="flex justify-between items-center p-3">
                Badge card actions
              </div>
            </div>
          )}

          <br />

          {/* Plots */}
          <div className="flex flex-col gap-4">
            {plots &&
              plots.length > 0 &&
              plots.map(plot => <CardPlot key={plot.uid} plot={plot} />)}
          </div>
        </div>

        {/* Bottom Menu bar */}
        <div className="mt-auto">
          <MenuBar />
        </div>
      </div>
    </>
  );
};

export default ObservationPage;

const parcelles: Plot[] = [
  {
    uid: "p1",
    nom: "Parcelle B",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r1", nom: "Rosier 1", archived: false },
    delayPassed: true,
    archived: false,
  },
  {
    uid: "p3",
    nom: "TNT",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r2", nom: "Rosier 2", archived: true },
    delayPassed: true,
    archived: true,
  },
  {
    uid: "p2",
    nom: "Parcelle A",
    map_expl: { uid: "e1", nom: "Test 1" },
    map_rosier: { uid: "r3", nom: "Rosier 3", archived: true },
    delayPassed: true,
    archived: false,
  },
];
