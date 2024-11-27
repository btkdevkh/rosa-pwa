"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/PageWrapper";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import PlotModalOptions from "@/app/components/modals/plots/PlotModalOptions";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import CardRosier from "@/app/components/cards/rosiers/CardRosier";
import { Rosier } from "@/app/models/interfaces/Rosier";
import dataASC from "@/app/helpers/dataASC";
import ModalDeleteConfirm from "@/app/components/modals/ModalDeleteConfirm";

const IdPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plotParamName = searchParams.get("nom");
  const plotParamUID = searchParams.get("uid");

  const [query, setQuery] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showArchivedRosiers, setShowArchivedRosiers] = useState(false);
  const [confirmDeletePlot, setConfirmDeletePlot] = useState(false);

  const rosiersByPlot = rosiersFake.filter(
    rosier => rosier.map_zone.uid === plotParamUID
  );

  const areAllRosiersArchived = rosiersByPlot.every(rosier => rosier.archived);
  const rosiersArchived = rosiersByPlot.filter(rosier => rosier.archived);
  const rosiersNonArchived = rosiersByPlot.filter(rosier => !rosier.archived);
  const rosiersArchivedArray = showArchivedRosiers ? rosiersArchived : [];

  const rosiers = dataASC(
    [...rosiersNonArchived, ...rosiersArchivedArray],
    "nom"
  ).filter(d =>
    query && !d.nom.toLowerCase().includes(query.toLowerCase()) ? false : true
  );

  // Supprimer la parcelle
  const handleDeletePlot = (uid: string | null) => {
    if (plotParamUID) {
      console.log("uid :", uid);
      // @todo: DB stuffs

      // Redirect
      toastSuccess(`Parcelle supprimée`, "delete-success");
      router.push(`/observations`);
    }
  };

  useEffect(() => {
    if (confirmDeletePlot) {
      const delete_plot_modal = document.getElementById(
        "delete_confirm_modal"
      ) as HTMLDialogElement;

      if (delete_plot_modal) {
        delete_plot_modal.showModal();
      }
    }
  }, [confirmDeletePlot]);

  return (
    <PageWrapper
      pageTitle="Rospot | Parcelle"
      navBarTitle={plotParamName ?? "n/a"}
      back={true}
    >
      {/* Search options top bar */}
      <div>
        <SearchOptions
          query={query}
          setQuery={setQuery}
          setShowOptionsModal={setShowOptionsModal}
        />

        {/* Options Modal */}
        {showOptionsModal && (
          <ModalWrapper closeOptionModal={() => setShowOptionsModal(false)}>
            <PlotModalOptions
              onClickAddPlot={() => {
                router.push(
                  `/observations/plots/updatePlot?uid=${plotParamUID}&nom=${plotParamName}`
                );
              }}
              showArchivedRosiers={showArchivedRosiers}
              onClickDeletePlot={() => setConfirmDeletePlot(true)}
              setShowArchivedRosiers={setShowArchivedRosiers}
            />
          </ModalWrapper>
        )}
      </div>

      <div className="container mx-auto">
        {/* Plots */}
        <div className="flex flex-col gap-4">
          {rosiers.length === 0 && !areAllRosiersArchived && (
            <p className="text-center">
              Aucun rosier enregistré dans cette parcelle.
            </p>
          )}

          {rosiers.length === 0 && areAllRosiersArchived && (
            <p className="text-center">
              Tous les rosiers de cette parcelle sont archivés.
            </p>
          )}

          {rosiers &&
            rosiers.length > 0 &&
            rosiers.map(rosier => (
              <CardRosier key={rosier.uid} rosier={rosier} />
            ))}
        </div>
      </div>

      {/* Confirm delete plot modal */}
      {confirmDeletePlot && (
        <ModalDeleteConfirm
          handleConfirmDelete={() => setConfirmDeletePlot(false)}
          handleDelete={() => handleDeletePlot(plotParamUID)}
        />
      )}
    </PageWrapper>
  );
};

export default IdPage;

// Fake data
export const rosiersFake: Rosier[] = [
  {
    uid: "r1",
    nom: "Rosier A1",
    editionDelay: true,
    archived: false,
    map_zone: {
      uid: "p1",
      nom: "Parcelle B",
    },
  },
  {
    uid: "r2",
    nom: "Rosier A2",
    editionDelay: false,
    archived: false,
    map_zone: {
      uid: "p2",
      nom: "Parcelle A",
    },
  },
  {
    uid: "r3",
    nom: "Rosier A3",
    editionDelay: false,
    archived: true,
    map_zone: {
      uid: "p2",
      nom: "Parcelle A",
    },
  },
];
