"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/shared/PageWrapper";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import RosierModalOptions from "@/app/components/modals/rosiers/RosierModalOptions";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import ModalDeleteConfirm from "@/app/components/modals/ModalDeleteConfirm";
import ObserveRosierForm from "@/app/components/forms/rosiers/ObserveRosierForm";
import StickyMenuBarWrapper from "@/app/components/shared/StickyMenuBarWrapper";
import { chantier } from "@/app/chantiers";
import deleteRosier from "@/app/services/rosiers/deleteRosier";

const IdRosierPageClient = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const rosierParamID = searchParams.get("rosierID");
  const rosierParamName = searchParams.get("rosierName");
  const plotParamID = searchParams.get("plotID");
  const plotParamName = searchParams.get("plotName");

  const [query, setQuery] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [confirmDeleteRosier, setConfirmDeleteRosier] = useState(false);

  const handleDeleteRosier = async (id: number | null) => {
    if (id) {
      // Process to DB
      const response = await deleteRosier(id);

      if (response && response.status === 200) {
        // Redirect
        toastSuccess(`Rosier supprimée`, "delete-rosier-success");
        router.push(
          `/observations/plots/plot?plotID=${plotParamID}&plotName=${plotParamName}`
        );
      }
    }
  };

  useEffect(() => {
    if (confirmDeleteRosier) {
      const delete_confirm_modal = document.getElementById(
        "delete_confirm_modal"
      ) as HTMLDialogElement;

      if (delete_confirm_modal) {
        delete_confirm_modal.showModal();
      }
    } else {
      setShowOptionsModal(false);
    }
  }, [confirmDeleteRosier]);

  return (
    <PageWrapper
      pageTitle="Rospot | Rosier"
      navBarTitle={rosierParamName ?? "n/a"}
      back={true}
    >
      {/* Search options top bar with sticky */}
      <StickyMenuBarWrapper>
        <SearchOptions
          query={query}
          setQuery={setQuery}
          setShowOptionsModal={setShowOptionsModal}
          searchable={false}
        />

        {/* Options Modal */}
        {showOptionsModal && !confirmDeleteRosier && (
          <ModalWrapper closeOptionModal={() => setShowOptionsModal(false)}>
            <RosierModalOptions
              onClickUpdateRosier={() => {
                router.push(
                  `/observations/plots/rosiers/updateRosier?rosierID=${rosierParamID}&rosierName=${rosierParamName}&plotID=${plotParamID}&plotName=${plotParamName}`
                );
              }}
              onClickDeleteRosier={() => setConfirmDeleteRosier(true)}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      <div className="container mx-auto">
        {/* Rosier form */}
        {chantier.CHANTIER_4.onDevelopment && (
          <ObserveRosierForm rosierID={rosierParamID} />
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDeleteRosier && (
        <ModalDeleteConfirm
          whatToDeletTitle="ce rosier"
          handleDelete={() =>
            handleDeleteRosier(rosierParamID ? +rosierParamID : null)
          }
          handleConfirmCancel={() => setConfirmDeleteRosier(false)}
          description="Toutes les observations enregistrées sur ce rosier de cette parcelle
          seront perdues."
        />
      )}
    </PageWrapper>
  );
};

export default IdRosierPageClient;
