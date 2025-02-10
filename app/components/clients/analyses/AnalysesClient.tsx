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
import MultiIndicatorsTemporalSerie from "./widgets/series/MultiIndicatorsTemporalSerie";
import { ObservationWidget } from "@/app/models/types/analyses/ObservationWidget";
import { NivoLineSerie } from "@/app/models/types/analyses/NivoLineSeries";
import { DiseaseEnum } from "@/app/models/enums/DiseaseEnum";

type AnalysesClientProps = {
  widgets: ObservationWidget[];
};

const AnalysesClient = ({ widgets: widgetGraphiques }: AnalysesClientProps) => {
  const router = useRouter();
  const { selectedExploitationOption } = use(ExploitationContext);

  const [loading, setLoading] = useState(true);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleReorganiseGraph = () => {
    if (
      selectedExploitationOption &&
      selectedExploitationOption.dashboard &&
      selectedExploitationOption.dashboard.id
    ) {
      router.push(
        `${MenuUrlPath.ANALYSES}/widgets/reorderWidget?dashboardID=${selectedExploitationOption.dashboard.id}`
      );
    }
  };

  useEffect(() => {
    if (
      selectedExploitationOption &&
      selectedExploitationOption.dashboard &&
      selectedExploitationOption.dashboard.id
    ) {
      router.replace(
        `${MenuUrlPath.ANALYSES}?explID=${selectedExploitationOption.id}&dasboardID=${selectedExploitationOption.dashboard.id}`
      );
    }
  }, [router, selectedExploitationOption]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (widgetGraphiques.length >= 0) {
        setLoading(false);
      }
    })();
  }, [widgetGraphiques]);

  // Data @nivo/line (single indicator)
  const series: NivoLineSerie[] = widgetGraphiques
    .map(widgetGraphique => {
      if (
        widgetGraphique.widget.params.indicateurs &&
        widgetGraphique.widget.params.indicateurs.length > 0
      ) {
        return {
          id_widget: widgetGraphique.widget.id as number,
          id: `Fréquence rouille`,
          color: widgetGraphique.widget.params.indicateurs[0].couleur,
          data: widgetGraphique.observations
            .map(obs => {
              return {
                x: new Date(obs.timestamp as Date),
                y:
                  (obs.data.rouille && obs.data.rouille.freq) ||
                  (obs.data.rouille && obs.data.rouille.freq === 0)
                    ? obs.data.rouille.freq
                    : null,
              };
            })
            .filter(d => d.y != null), // !d.y
        };
      }
    })
    .filter(d => d != undefined);

  // @todo: Chantier 6
  // Data @nivo/line (multi indicators)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const seriesMulti = widgetGraphiques.flatMap(widgetGraphique => {
    if (
      widgetGraphique.widget.params.indicateurs &&
      widgetGraphique.widget.params.indicateurs.length > 0
    ) {
      return widgetGraphique.widget.params.indicateurs.flatMap(indicateur => {
        const indicator = widgetGraphique.indicateurs.find(
          indicator => indicator.id === indicateur.id
        );

        // Format disease name
        // .replaceAll(/é.è.ê/gi, "e");
        const disease = indicator?.nom?.split(" ")[1];

        return {
          id: `${indicator?.nom}`,
          color: indicateur.couleur,
          data: widgetGraphique.observations
            .flatMap(obs => {
              if (disease === DiseaseEnum.ROUILLE && obs.data.rouille) {
                return {
                  x: new Date(obs.timestamp as Date),
                  y:
                    obs.data.rouille.freq || obs.data.rouille.freq === 0
                      ? obs.data.rouille.freq
                      : null,
                };
              }

              if (disease === DiseaseEnum.ECIDISES && obs.data.ecidies) {
                return {
                  x: new Date(obs.timestamp as Date),
                  y:
                    obs.data.ecidies.freq || obs.data.ecidies.freq === 0
                      ? obs.data.ecidies.freq
                      : null,
                };
              }

              if (disease === DiseaseEnum.TELEUTOS && obs.data.teleutos) {
                return {
                  x: new Date(obs.timestamp as Date),
                  y:
                    obs.data.teleutos.freq || obs.data.teleutos.freq === 0
                      ? obs.data.teleutos.freq
                      : null,
                };
              }

              if (disease === DiseaseEnum.UREDOS && obs.data.uredos) {
                return {
                  x: new Date(obs.timestamp as Date),
                  y:
                    obs.data.uredos.freq || obs.data.uredos.freq === 0
                      ? obs.data.uredos.freq
                      : null,
                };
              }

              if (disease === DiseaseEnum.MARSONIA && obs.data.marsonia) {
                return {
                  x: new Date(obs.timestamp as Date),
                  y:
                    obs.data.marsonia.freq || obs.data.marsonia.freq === 0
                      ? obs.data.marsonia.freq
                      : null,
                };
              }
            })
            .filter(d => d != undefined)
            .filter(d => d.y != null), // !d.y
          id_widget: widgetGraphique.widget.id as number,
        };
      });
    }
  });

  // console.log("seriesMulti :", seriesMulti);
  // console.log("series :", series);

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
                router.push(`/analyses/widgets/addWidget`)
              }
              handleReorganiseGraph={handleReorganiseGraph}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      {/* Graphique container */}
      <div className="max-w-6xl w-full p-4 mx-auto">
        <div className="flex flex-col gap-4 mb-2">
          {/* Loading */}
          {loading && widgetGraphiques.length === 0 && <Loading />}

          {!loading && widgetGraphiques.length === 0 && (
            <div className="text-center">
              <p>Aucune donnée disponible</p>
            </div>
          )}

          {/* Graphique */}
          {widgetGraphiques.length > 0 &&
            widgetGraphiques.map(widgetGraphique => {
              return (
                <MultiIndicatorsTemporalSerie
                  key={widgetGraphique.widget.id}
                  widgetData={{
                    widget: widgetGraphique.widget,
                    series: series.filter(
                      s => s.id_widget === widgetGraphique.widget.id
                    ) as NivoLineSerie[],

                    // @todo: Chantier 6
                    // series: seriesMulti.filter(
                    //   s => s?.id_widget === widgetGraphique.widget.id
                    // ) as NivoLineSerie[],
                  }}
                />
              );
            })}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AnalysesClient;
