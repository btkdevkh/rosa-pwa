"use client";

import { useState } from "react";
import Loading from "../../shared/loaders/Loading";
import ModalWrapper from "../../modals/ModalWrapper";
import PageWrapper from "../../shared/wrappers/PageWrapper";
import useGetWidgets from "@/app/hooks/widgets/useGetWidgets";
import { DiseaseEnum } from "@/app/models/enums/DiseaseEnum";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import SearchOptionsAnalyses from "../../searchs/SearchOptionsAnalyses";
import { NivoLineSerie } from "@/app/models/types/analyses/NivoLineSeries";
import AnalysesModalOptions from "../../modals/analyses/AnalysesModalOptions";
import StickyMenuBarWrapper from "../../shared/wrappers/StickyMenuBarWrapper";
import MultiIndicatorsTemporalSerie from "./widgets/series/MultiIndicatorsTemporalSerie";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";

const AnalysesClient = () => {
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const {
    loading,
    success,
    widgets: widgetGraphiques,
  } = useGetWidgets(explID, dashboardID);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;

  // Data @nivo/line (single indicator)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const series: NivoLineSerie[] | undefined = widgetGraphiques
    ?.map(widgetGraphique => {
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

  const seriesAVG: NivoLineSerie[] | undefined = widgetGraphiques
    ?.map(widgetGraphique => {
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
  const seriesMulti = widgetGraphiques?.flatMap(widgetGraphique => {
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
  // console.log("seriesAVG :", seriesAVG);

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
                `${MenuUrlPath.ANALYSES}/widgets/addWidget?${explQueries}`,
                `${MenuUrlPath.ANALYSES}/widgets/reorderWidget?${explQueries}`,
              ]}
            />
          </ModalWrapper>
        )}
      </StickyMenuBarWrapper>

      {/* Graphique container */}
      <div className="max-w-6xl w-full p-4 mx-auto">
        <div className="flex flex-col gap-4 mb-2">
          {/* Loading */}
          {loading && <Loading />}

          {/* Aucune donnée */}
          {!success && !widgetGraphiques && (
            <div className="text-center">
              <p>
                Aucun graphique enregistré. <br /> Pour créer un graphique,
                appuyez sur le bouton en haut à droite de l&apos;écran puis
                choisissez &quot;Créer un graphique&quot;.
              </p>
            </div>
          )}

          {/* Graphique */}
          {success &&
            widgetGraphiques &&
            widgetGraphiques.length > 0 &&
            widgetGraphiques.map(widgetGraphique => {
              return (
                <MultiIndicatorsTemporalSerie
                  key={widgetGraphique.widget.id}
                  widgetData={{
                    widget: widgetGraphique.widget,
                    series: seriesAVG?.filter(
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
