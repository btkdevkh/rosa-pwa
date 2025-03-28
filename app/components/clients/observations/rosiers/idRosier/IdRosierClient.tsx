"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import SearchOptions from "@/app/components/searchs/SearchOptions";
import ModalWrapper from "@/app/components/modals/ModalWrapper";
import RosierModalOptions from "@/app/components/modals/rosiers/RosierModalOptions";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import ModalDeleteConfirm from "@/app/components/modals/ModalDeleteConfirm";
import ObserveRosierForm from "@/app/components/forms/rosiers/ObserveRosierForm";
import StickyMenuBarWrapper from "@/app/components/shared/wrappers/StickyMenuBarWrapper";
import deleteRosier from "@/app/services/rosiers/deleteRosier";
import useGetObservations from "@/app/hooks/rosiers/observations/useGetObservations";
import Loading from "@/app/components/shared/loaders/Loading";
import useCustomRosierSearchParams from "@/app/hooks/useCustomRosierSearchParams";
import useCustomPlotSearchParams from "@/app/hooks/useCustomPlotSearchParams";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";

const IdRosierClient = () => {
  const router = useRouter();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { rosierID, rosierName } = useCustomRosierSearchParams();
  const { plotID, plotName, plotArchived } = useCustomPlotSearchParams();

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;

  const { loading, observations: observationData } =
    useGetObservations(rosierID);

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
          `${MenuUrlPath.OBSERVATIONS}/plots/plot?${explQueries}&plotID=${plotID}&plotName=${plotName}&archived=${plotArchived}`
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
    observationData && observationData.length > 0 ? observationData[0] : null;

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

  const allObservationAreAnteriorOfTheCurrentYear = observationData?.every(
    (observation) => {
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

  const pathUrl = `${MenuUrlPath.OBSERVATIONS}/plots/plot?${explQueries}&plotID=${plotID}&plotName=${plotName}&archived=${plotArchived}`;

  return (
    <PageWrapper
      pageTitle="Rosa | Rosier"
      navBarTitle={rosierName ?? "n/a"}
      back={true}
      emptyData={emptyData}
      pathUrl={pathUrl}
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
                `${MenuUrlPath.OBSERVATIONS}/plots/rosiers/updateRosier?${explQueries}&rosierID=${rosierID}&rosierName=${rosierName}&plotID=${plotID}&plotName=${plotName}&archived=${plotArchived}`,
              ]}
              onClickDeleteRosier={() => setConfirmDeleteRosier(true)}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      <div className="container mx-auto">
        {/* Loading */}
        {loading && <Loading />}

        {/* Rosier form */}
        <ObserveRosierForm
          rosierID={rosierID}
          lastObservation={lastObservation}
          lastObservationDate={lastObservationDate?.slice(0, 5) ?? null}
          editableDelayPassed={editableDelayPassed}
          setEmptyData={setEmptyData}
        />
      </div>

      {/* Confirm delete modal */}
      {confirmDeleteRosier && (
        <ModalDeleteConfirm
          whatToDeletTitle="ce rosier"
          handleDelete={() => handleDeleteRosier(rosierID ? +rosierID : null)}
          handleConfirmCancel={() => setConfirmDeleteRosier(false)}
          description="Toutes les observations enregistrées sur ce rosier de cette parcelle
          seront perdues."
        />
      )}
    </PageWrapper>
  );
};

export default IdRosierClient;
