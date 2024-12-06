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
import StickyMenuBarWrapper from "@/app/components/StickyMenuBarWrapper";

type IdPlotPageClientProps = {
  rosierData: Rosier[];
};

const IdPlotPageClient = ({ rosierData }: IdPlotPageClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plotParamID = searchParams.get("plotID");
  const plotParamName = searchParams.get("plotName");

  const [query, setQuery] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showArchivedRosiers, setShowArchivedRosiers] = useState(false);
  const [confirmDeletePlot, setConfirmDeletePlot] = useState(false);

  const rosiersByPlot = rosierData.filter(
    rosier => plotParamID && rosier.id_parcelle === +plotParamID
  );

  const areAllRosiersArchived = rosiersByPlot.every(
    rosier => rosier.est_archive
  );
  const rosiersArchived = rosiersByPlot.filter(rosier => rosier.est_archive);
  const rosiersNonArchived = rosiersByPlot.filter(
    rosier => !rosier.est_archive
  );
  const rosiersArchivedArray = showArchivedRosiers ? rosiersArchived : [];

  const rosiers = dataASC(
    [...rosiersNonArchived, ...rosiersArchivedArray],
    "nom"
  ).filter(d =>
    query && !d.nom.toLowerCase().includes(query.toLowerCase()) ? false : true
  );

  // Supprimer la parcelle
  const handleDeletePlot = (id: number | null) => {
    if (plotParamID) {
      console.log("id :", id);
      // @todo: DB stuffs

      // Redirect
      toastSuccess(`Parcelle supprimée`, "delete-success");
      router.push(`/observations`);
    }
  };

  useEffect(() => {
    if (confirmDeletePlot) {
      const delete_confirm_modal = document.getElementById(
        "delete_confirm_modal"
      ) as HTMLDialogElement;

      if (delete_confirm_modal) {
        delete_confirm_modal.showModal();
      }
    } else {
      setShowOptionsModal(false);
    }
  }, [confirmDeletePlot]);

  return (
    <PageWrapper
      pageTitle="Rospot | Parcelle"
      navBarTitle={plotParamName ?? "n/a"}
      back={true}
    >
      {/* Search options top bar */}
      <StickyMenuBarWrapper>
        <SearchOptions
          query={query}
          setQuery={setQuery}
          setShowOptionsModal={setShowOptionsModal}
        />

        {/* Options Modal */}
        {showOptionsModal && !confirmDeletePlot && (
          <ModalWrapper closeOptionModal={() => setShowOptionsModal(false)}>
            <PlotModalOptions
              onClickUpdatePlot={() => {
                router.push(
                  `/observations/plots/updatePlot?plotID=${plotParamID}&plotName=${plotParamName}`
                );
              }}
              showArchivedRosiers={showArchivedRosiers}
              onClickDeletePlot={() => setConfirmDeletePlot(true)}
              setShowArchivedRosiers={setShowArchivedRosiers}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

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
              <CardRosier key={rosier.id} rosier={rosier} />
            ))}
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmDeletePlot && (
        <ModalDeleteConfirm
          whatToDeletTitle="cette parcelle"
          handleDelete={() =>
            handleDeletePlot(plotParamID ? +plotParamID : null)
          }
          handleConfirmCancel={() => setConfirmDeletePlot(false)}
          description="Toutes les observations enregistrées sur les rosiers de cette parcelle
          seront perdues."
        />
      )}
    </PageWrapper>
  );
};

export default IdPlotPageClient;
