"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import { Rosier } from "@/app/models/interfaces/Rosier";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import PlotModalOptions from "@/app/components/modals/plots/PlotModalOptions";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import CardRosier from "@/app/components/cards/rosiers/CardRosier";
import dataASC from "@/app/helpers/dataASC";
import ModalDeleteConfirm from "@/app/components/modals/ModalDeleteConfirm";
import StickyMenuBarWrapper from "@/app/components/shared/wrappers/StickyMenuBarWrapper";
import deletePlot from "@/app/services/plots/deletePlot";
import Loading from "@/app/components/shared/loaders/Loading";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import { Observation } from "@/app/models/interfaces/Observation";

type IdPlotClientProps = {
  rosiers: Rosier[] | null;
  observations: Observation[] | null;
};

const IdPlotClient = ({
  rosiers: rosierData,
  observations: observationData,
}: IdPlotClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plotParamID = searchParams.get("plotID");
  const plotParamName = searchParams.get("plotName");
  const plotParamArchived = searchParams.get("archived");

  const [query, setQuery] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showArchivedRosiers, setShowArchivedRosiers] = useState(false);
  const [confirmDeletePlot, setConfirmDeletePlot] = useState(false);

  const allRosiersArchived = rosierData
    ? rosierData.every(rosier => rosier.est_archive)
    : false;
  const rosiersArchived = rosierData
    ? rosierData.filter(rosier => rosier.est_archive)
    : [];
  const rosiersNonArchived = rosierData
    ? rosierData.filter(rosier => !rosier.est_archive)
    : [];
  const rosiersArchivedArray = showArchivedRosiers ? rosiersArchived : [];

  const rosiers = dataASC(
    [...rosiersNonArchived, ...rosiersArchivedArray],
    "nom"
  ).filter(d =>
    query && !d.nom.toLowerCase().includes(query.toLowerCase()) ? false : true
  );

  // Supprimer la parcelle
  const handleDeletePlot = async (plotID: string | null) => {
    if (plotID) {
      // Delete from DB
      const response = await deletePlot(+plotID);

      if (response && response.status === 200) {
        // Redirect
        toastSuccess(`Parcelle supprimée`, "delete-success");
        router.push(MenuUrlPath.OBSERVATIONS);
      } else {
        toastSuccess(`Veuillez réessayer plus tard!`, "delete-failed");
      }
    } else {
      toastSuccess(`Veuillez réessayer plus tard!`, "delete-failed");
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
      pathUrl={`/observations`}
    >
      <>
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
                pathUrls={[
                  `/observations/plots/updatePlot?plotID=${plotParamID}&plotName=${plotParamName}&archived=${plotParamArchived}`,
                ]}
                showArchivedRosiers={showArchivedRosiers}
                onClickDeletePlot={() => setConfirmDeletePlot(true)}
                setShowArchivedRosiers={setShowArchivedRosiers}
              />
            </ModalWrapper>
          )}
        </StickyMenuBarWrapper>

        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            {rosierData && rosierData.length === 0 && <Loading />}

            {rosierData && rosierData.length === 0 && (
              <p className="text-center">
                Aucun rosier enregistré dans cette parcelle
              </p>
            )}

            {query !== "" && rosiers.length === 0 && !allRosiersArchived && (
              <p className="text-center">
                Il n&apos;existe pas de rosier avec ce nom
              </p>
            )}

            {!showArchivedRosiers &&
              rosiersArchived.length > 0 &&
              allRosiersArchived && (
                <p className="text-center">
                  Tous les rosiers de cette parcelle sont archivés.
                </p>
              )}

            {/* Rosiers */}
            {rosiers &&
              rosiers.length > 0 &&
              rosiers.map(rosier => (
                <CardRosier
                  key={rosier.id}
                  rosier={rosier}
                  observations={observationData}
                />
              ))}
          </div>
        </div>

        {/* Confirm delete modal */}
        {confirmDeletePlot && (
          <ModalDeleteConfirm
            whatToDeletTitle="cette parcelle"
            handleDelete={() => handleDeletePlot(plotParamID)}
            handleConfirmCancel={() => setConfirmDeletePlot(false)}
            description="Toutes les observations enregistrées sur les rosiers de cette parcelle
          seront perdues."
          />
        )}
      </>
    </PageWrapper>
  );
};

export default IdPlotClient;
