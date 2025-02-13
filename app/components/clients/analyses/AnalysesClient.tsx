"use client";

import { ReactNode, use, useEffect, useState } from "react";
import PageWrapper from "../../shared/wrappers/PageWrapper";
import ModalWrapper from "../../modals/ModalWrapper";
import StickyMenuBarWrapper from "../../shared/wrappers/StickyMenuBarWrapper";
import AnalysesModalOptions from "../../modals/analyses/AnalysesModalOptions";
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
  msg?: ReactNode;
};

const AnalysesClient = ({
  widgets: widgetGraphiques,
  msg,
}: AnalysesClientProps) => {
  const router = useRouter();
  const { selectedExploitationOption } = use(ExploitationContext);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const getReorganiseGraphUrl = () => {
    if (
      selectedExploitationOption &&
      selectedExploitationOption.dashboard &&
      selectedExploitationOption.dashboard.id
    ) {
      return `${MenuUrlPath.ANALYSES}/widgets/reorderWidget?explID=${selectedExploitationOption.id}&dashboardID=${selectedExploitationOption.dashboard.id}`;
    }

    return "";
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
              const obsDate = new Date(obs.timestamp as Date);

              return {
                x: obsDate,
                y:
                  (obs.data.rouille && obs.data.rouille.freq) ||
                  (obs.data.rouille && obs.data.rouille.freq === 0)
                    ? obs.data.rouille.freq
                    : null,
              };
            })
            .filter(d => d.y != null)
            .sort((a, b) => a.x.getTime() - b.x.getTime()),
        };
      }
    })
    .filter(d => d != undefined);

  const seriesAVG: NivoLineSerie[] = widgetGraphiques
    .map(widgetGraphique => {
      if (
        widgetGraphique.widget.params.indicateurs &&
        widgetGraphique.widget.params.indicateurs.length > 0
      ) {
        const dataMap = new Map<string, { sum: number; count: number }>();

        widgetGraphique.observations.forEach(obs => {
          const obsDate = new Date(obs.timestamp as Date);
          const dateKey = obsDate.toISOString().split("T")[0]; // Use only the date part as key

          if (
            obs.data.rouille?.freq !== undefined &&
            obs.data.rouille.freq !== null
          ) {
            if (!dataMap.has(dateKey)) {
              dataMap.set(dateKey, { sum: 0, count: 0 });
            }

            const entry = dataMap.get(dateKey);
            if (entry) {
              entry.sum += obs.data.rouille.freq;
              entry.count += 1;
            }
          }
        });

        const averagedData = Array.from(dataMap.entries()).map(
          ([date, { sum, count }]) => ({
            x: new Date(date),
            y: Math.round((sum / count) * 100) / 100,
          })
        );

        return {
          id_widget: widgetGraphique.widget.id as number,
          id: `Fréquence rouille`,
          color: widgetGraphique.widget.params.indicateurs[0].couleur,
          data: averagedData.sort((a, b) => a.x.getTime() - b.x.getTime()),
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
  console.log("series :", series);
  console.log("seriesAVG :", seriesAVG);

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
              pathUrls={[
                "/analyses/widgets/addWidget",
                getReorganiseGraphUrl(),
              ]}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      {/* Graphique container */}
      <div className="max-w-6xl w-full p-4 mx-auto">
        <div className="flex flex-col gap-4 mb-2">
          {/* Info message */}
          {msg}

          {/* Graphique */}
          {widgetGraphiques.length > 0 &&
            widgetGraphiques.map(widgetGraphique => {
              return (
                <MultiIndicatorsTemporalSerie
                  key={widgetGraphique.widget.id}
                  widgetData={{
                    widget: widgetGraphique.widget,
                    series: seriesAVG.filter(
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
