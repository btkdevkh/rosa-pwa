"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/PageWrapper";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import RosierModalOptions from "@/app/components/modals/rosiers/RosierModalOptions";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import ModalDeleteConfirm from "@/app/components/modals/ModalDeleteConfirm";
import ObserveRosierForm from "@/app/components/forms/rosiers/ObserveRosierForm";
import StickyMenuBarWrapper from "@/app/components/StickyMenuBarWrapper";

const IdRosierPageClient = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const rosierParamUID = searchParams.get("uid");
  const rosierParamName = searchParams.get("nom");
  const plotParamName = searchParams.get("plotName");
  const plotParamUID = searchParams.get("plotUID");

  const [query, setQuery] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showArchivedRosiers, setShowArchivedRosiers] = useState(false);
  const [confirmDeleteRosier, setConfirmDeleteRosier] = useState(false);

  const handleDeleteRosier = (uid: string | null) => {
    if (rosierParamUID) {
      console.log("uid :", uid);
      // @todo: DB stuffs

      // Redirect
      toastSuccess(`Rosier supprimée`, "delete-rosier-success");
      router.push(
        `/observations/plots/plot?uid=${plotParamUID}&nom=${plotParamName}`
      );
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
              showArchivedRosiers={showArchivedRosiers}
              onClickUpdateRosier={() => {
                router.push(
                  `/observations/plots/rosiers/updateRosier?uid=${rosierParamUID}&nom=${rosierParamName}&plotUID=${plotParamUID}&plotName=${plotParamName}`
                );
              }}
              onClickDeleteRosier={() => setConfirmDeleteRosier(true)}
              setShowArchivedRosiers={setShowArchivedRosiers}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      <div className="container mx-auto">
        {/* Rosier form */}
        <ObserveRosierForm />
      </div>

      {/* Confirm delete modal */}
      {confirmDeleteRosier && (
        <ModalDeleteConfirm
          whatToDeletTitle="ce rosier"
          handleDelete={() => handleDeleteRosier(rosierParamUID)}
          handleConfirmCancel={() => setConfirmDeleteRosier(false)}
          description="Toutes les observations enregistrées sur ce rosier de cette parcelle
          seront perdues."
        />
      )}
    </PageWrapper>
  );
};

export default IdRosierPageClient;
