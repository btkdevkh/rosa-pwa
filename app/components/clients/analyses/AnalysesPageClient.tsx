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
import SearchOptionsAnalyses from "../../searchs/SearchOptionsAnalyses";
import MultiIndicatorsTemporalSerie from "./widgets/MultiIndicatorsTemporalSerie";
import { ObservationWidget } from "@/app/models/types/analyses/ObservationWidget";
import { NivoLineSeries } from "@/app/models/types/analyses/NivoLineSeries";
import { ColorIndicatorEnum } from "@/app/models/enums/ColorIndicatorEnum";

type AnalysesPageClientProps = {
  widgets: ObservationWidget[];
};

const AnalysesPageClient = ({
  widgets: widgetGraphiques,
}: AnalysesPageClientProps) => {
  console.log("widgetGraphiques :", widgetGraphiques);

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

  // Data @nivo/line
  const series: NivoLineSeries[] = widgetGraphiques.map(widgetGraphique => {
    return {
      id_widget: widgetGraphique.widget.id as number,
      id: `Fréquence rouille`,
      color: ColorIndicatorEnum.COLOR_1,
      data: widgetGraphique.observations
        // On filtre que les freq rouille qui ont une valeur ou 0
        .filter(obs => obs.data.rouille?.freq || obs.data?.rouille?.freq === 0)
        .map(obs => {
          return {
            x: new Date(obs.timestamp as Date),
            y:
              (obs.data.rouille && obs.data.rouille.freq) ||
              obs.data?.rouille?.freq === 0
                ? obs.data.rouille.freq
                : null,
          };
        }),
    };
  });

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
        <div className="flex flex-col gap-4 mb-2">
          {loading && <Loading />}
          {!loading && widgetGraphiques.length === 0 && (
            <div className="text-center">
              <p>Aucun graphique à afficher,</p>
              <p>Veuillez créer votre graphique.</p>
            </div>
          )}

          {/* Graphique */}
          {widgetGraphiques.length > 0 &&
            widgetGraphiques
              // .filter(w => w.observations.length > 0)
              .map(widgetGraphique => {
                return (
                  <MultiIndicatorsTemporalSerie
                    key={widgetGraphique.widget.id}
                    widgetData={{
                      widget: widgetGraphique.widget,
                      series: series.filter(
                        s => s.id_widget === widgetGraphique.widget.id
                      ),
                    }}
                  />
                );
              })}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AnalysesPageClient;
