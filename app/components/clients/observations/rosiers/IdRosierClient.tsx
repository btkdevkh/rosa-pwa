"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import RosierModalOptions from "@/app/components/modals/rosiers/RosierModalOptions";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import ModalDeleteConfirm from "@/app/components/modals/ModalDeleteConfirm";
import ObserveRosierForm from "@/app/components/forms/rosiers/ObserveRosierForm";
import StickyMenuBarWrapper from "@/app/components/shared/wrappers/StickyMenuBarWrapper";
import deleteRosier from "@/app/services/rosiers/deleteRosier";
import { Observation } from "@/app/models/interfaces/Observation";

type IdRosierClientProps = {
  observations: Observation[];
};

const IdRosierClient = ({
  observations: observationData,
}: IdRosierClientProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const rosierParamID = searchParams.get("rosierID");
  const rosierParamName = searchParams.get("rosierName");
  const plotParamID = searchParams.get("plotID");
  const plotParamName = searchParams.get("plotName");
  const plotParamArchived = searchParams.get("archived");

  const [query, setQuery] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [confirmDeleteRosier, setConfirmDeleteRosier] = useState(false);
  const [emptyData, setEmptyData] = useState(true);

  const handleDeleteRosier = async (id: number | null) => {
    if (id) {
      // Process to DB
      const response = await deleteRosier(id);

      if (response && response.status === 200) {
        // Redirect
        toastSuccess(`Rosier supprimée`, "delete-rosier-success");
        router.push(
          `/observations/plots/plot?plotID=${plotParamID}&plotName=${plotParamName}&archived=${plotParamArchived}`
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

  // Last observation date
  const lastObservation =
    observationData.length > 0 ? observationData[0] : null;

  const formatDate = lastObservation?.timestamp
    ?.toLocaleString()
    .split("T")[0]
    .split("-");
  const lastObservationDate = formatDate
    ? `${formatDate[2]}/${formatDate[1]}/${formatDate[0]}`
    : null;

  // Current date
  const currDate = new Date();
  const currYY = currDate.getFullYear();
  const currMM = currDate.getMonth() + 1;
  const currDD = currDate.getDate();

  // Obs date
  const obsYY = lastObservationDate && lastObservationDate.split("/")[2];
  const obsMM = lastObservationDate && lastObservationDate.split("/")[1];
  const obsDD = lastObservationDate && lastObservationDate.split("/")[0];

  // Delai d'édition de l'observation est passé
  const editableDelayPassed =
    (obsYY && currYY > +obsYY) ||
    (obsYY &&
      obsMM &&
      obsDD &&
      currYY === +obsYY &&
      currMM === +obsMM &&
      currDD - +obsDD > 3) ||
    (obsYY && obsMM && obsDD && currYY === +obsYY && currMM > +obsMM);

  const allObservationAreAnteriorOfTheCurrentYear = observationData.every(
    observation => {
      // Current year
      const currYear = new Date().getFullYear();

      // Obs year
      const obsYear = observation.timestamp
        ?.toLocaleString()
        .split("T")[0]
        .split("-")[0];

      return obsYear ? +obsYear < currYear : false;
    }
  );

  // Detect when the input field has been typed
  const handleUserHasTypedInTheInput = (
    targetValue?: string | number | null
  ) => {
    if (targetValue && targetValue.toString().length > 0) {
      setEmptyData(false);
    }
  };

  // console.log("lastObservationDate :", lastObservationDate);
  // console.log("editableDelayPassed :", editableDelayPassed);
  // console.log(
  //   "allObservationAreAnteriorOfTheCurrentYear :",
  //   allObservationAreAnteriorOfTheCurrentYear
  // );

  return (
    <PageWrapper
      pageTitle="Rospot | Rosier"
      navBarTitle={rosierParamName ?? "n/a"}
      back={true}
      emptyData={emptyData}
      pathUrl={`/observations/plots/plot?plotID=${plotParamID}&plotName=${plotParamName}&archived=${plotParamArchived}`}
    >
      {/* Search options top bar with sticky */}
      <StickyMenuBarWrapper>
        <SearchOptions
          query={query}
          setQuery={setQuery}
          setShowOptionsModal={setShowOptionsModal}
          searchable={false}
          lastObservationDate={lastObservationDate}
          editableDelayPassed={editableDelayPassed}
          allObservationAreAnteriorOfTheCurrentYear={
            allObservationAreAnteriorOfTheCurrentYear
          }
        />

        {/* Options Modal */}
        {showOptionsModal && !confirmDeleteRosier && (
          <ModalWrapper closeOptionModal={() => setShowOptionsModal(false)}>
            <RosierModalOptions
              pathUrls={[
                `/observations/plots/rosiers/updateRosier?rosierID=${rosierParamID}&rosierName=${rosierParamName}&plotID=${plotParamID}&plotName=${plotParamName}&archived=${plotParamArchived}`,
              ]}
              onClickDeleteRosier={() => setConfirmDeleteRosier(true)}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      <div className="container mx-auto">
        {/* Rosier form */}
        <ObserveRosierForm
          rosierID={rosierParamID}
          lastObservation={lastObservation}
          lastObservationDate={lastObservationDate?.slice(0, 5) ?? null}
          editableDelayPassed={editableDelayPassed}
          handleUserHasTypedInTheInput={handleUserHasTypedInTheInput}
        />
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

export default IdRosierClient;
