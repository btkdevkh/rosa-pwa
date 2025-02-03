"use client";

import { use, useEffect, useState } from "react";
import PageWrapper from "../../shared/PageWrapper";
import ModalWrapper from "../../modals/ModalWrapper";
import StickyMenuBarWrapper from "../../shared/StickyMenuBarWrapper";
import AnalysesModalOptions from "../../modals/analyses/AnalysesModalOptions";
import Loading from "../../shared/Loading";
import { useRouter } from "next/navigation";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import { Widget } from "@/app/models/interfaces/Widget";
import SearchOptionsAnalyses from "../../searchs/SearchOptionsAnalyses";
import { Observation } from "@/app/models/interfaces/Observation";
import MultiIndicatorsTemporalSerie from "./widgets/MultiIndicatorsTemporalSerie";
import SettingSmallGearIcon from "../../shared/SettingSmallGearIcon";

type ObservationWidget = {
  observations: Observation[];
  widget: Widget;
};

type AnalysesPageClientProps = {
  widgets: ObservationWidget[];
};

const AnalysesPageClient = ({
  widgets: widgetGraphiques,
}: AnalysesPageClientProps) => {
  const router = useRouter();
  const { selectedExploitationOption } = use(ExploitationContext);

  const [loading, setLoading] = useState(true);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleReorganiseGraph = () => {
    console.log("handleReorganiseGraph");
  };

  useEffect(() => {
    setLoading(false);

    if (selectedExploitationOption) {
      router.replace(
        `${MenuUrlPath.ANALYSES}?explID=${selectedExploitationOption.id}&dasboardID=${selectedExploitationOption.dashboard.id}`
      );
    }
  }, [router, selectedExploitationOption]);

  console.log("widgetGraphiques :", widgetGraphiques);

  return (
    <PageWrapper
      pageTitle="Rospot | Analyses"
      navBarTitle={"Analyses"}
      back={false}
    >
      <StickyMenuBarWrapper>
        {/* Search options top bar */}
        <SearchOptionsAnalyses setShowOptionsModal={setShowOptionsModal} />

        {/* Options Modal */}
        {showOptionsModal && (
          <ModalWrapper closeOptionModal={() => setShowOptionsModal(false)}>
            <AnalysesModalOptions
              onClickAddGraphique={() =>
                router.push(`/analyses/graphique/addGraphique`)
              }
              handleReorganiseGraph={handleReorganiseGraph}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      {/* Graphique container */}
      <div className="max-w-6xl w-full p-4 mx-auto">
        <div className="flex flex-col gap-4">
          {loading && <Loading />}
          {!loading && widgetGraphiques.length === 0 && (
            <div className="text-center">
              <p>Aucun graphique à afficher,</p>
              <p>Veuillez créer votre graphique.</p>
            </div>
          )}

          {/* Graphique */}
          <div className="h-[20rem] bg-white p-3">
            {widgetGraphiques.length > 0 && (
              <>
                {/* Title */}
                <div className="ml-3 flex gap-10 items-center">
                  <button
                    onClick={() => {
                      console.log("handleSettingGraphique");
                    }}
                  >
                    <SettingSmallGearIcon />
                  </button>
                  <h2 className="font-bold">
                    {widgetGraphiques[0].widget.params.nom}
                  </h2>
                </div>

                <MultiIndicatorsTemporalSerie
                  params={widgetGraphiques[0].widget.params}
                  idWidget={widgetGraphiques[0].widget.id}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AnalysesPageClient;

// "@nivo/axes": "^0.80.0",
// "@nivo/bar": "^0.80.0",
// "@nivo/core": "^0.80.0",
// "@nivo/line": "^0.80.0",
