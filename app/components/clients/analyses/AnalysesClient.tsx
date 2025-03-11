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
import { ObservationWidget } from "@/app/models/types/analyses/ObservationWidget";
import { JsonValue } from "@prisma/client/runtime/library";

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

  // seriesMultiAVG base on seireAVG but with multi indicators
  const seriesMultiAVG = widgetGraphiques
    ?.flatMap(widgetGraphique => {
      if (
        widgetGraphique.widget.params.indicateurs &&
        widgetGraphique.widget.params.indicateurs.length > 0
      ) {
        return widgetGraphique.widget.params.indicateurs.flatMap(indicateur => {
          const indicator = widgetGraphique.indicateurs.find(
            indicator => indicator.id === indicateur.id
          );

          return getSerieAVG(widgetGraphique, indicateur, indicator);
        });
      }
    })
    .filter(d => d != undefined);

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
      <div className="max-w-7xl w-full p-4 mx-auto">
        <div className="flex flex-col gap-7 mb-7">
          {/* Loading */}
          {loading && <Loading />}

          {/* Aucune donnée */}
          {(!success && !widgetGraphiques) ||
            (widgetGraphiques && widgetGraphiques.length === 0 && (
              <div className="text-center">
                <p>
                  Aucun graphique enregistré. <br /> Pour créer un graphique,
                  appuyez sur le bouton en haut à droite de l&apos;écran puis
                  choisissez &quot;Créer un graphique&quot;.
                </p>
              </div>
            ))}

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
                    series: seriesMultiAVG?.filter(
                      s => s?.id_widget === widgetGraphique.widget.id
                    ) as NivoLineSerie[],
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

const getSerieAVG = (
  widgetGraphique: ObservationWidget | null,
  indicateur: {
    couleur: string;
    id: number;
    min_max: number[];
  },
  indicator?: {
    nom: string | null;
    id: number;
    params: JsonValue | null;
    data_field: string | null;
    type_viz: string | null;
    id_axe: number | null;
  } | null
) => {
  // Format disease name
  // .replaceAll(/é.è.ê/gi, "e");
  const nom_indicateur = indicator && indicator.nom ? indicator.nom : "";
  const disease =
    nom_indicateur === "Nombre de feuilles"
      ? DiseaseEnum.NB_FEUILLES
      : nom_indicateur === "Fréquence rouille"
      ? DiseaseEnum.FREQ_ROUILLE
      : nom_indicateur === "Intensité rouille"
      ? DiseaseEnum.INT_ROUILLE
      : nom_indicateur === "Fréquence écidies"
      ? DiseaseEnum.FREQ_ECIDISES
      : nom_indicateur === "Fréquence téléutos"
      ? DiseaseEnum.FREQ_TELEUTOS
      : nom_indicateur === "Fréquence urédos"
      ? DiseaseEnum.FREQ_UREDOS
      : nom_indicateur === "Fréquence marsonia"
      ? DiseaseEnum.FREQ_MARSONIA
      : nom_indicateur === "Humectation foliaire"
      ? DiseaseEnum.NB_HUMECTATION_FOLIAIRE
      : nom_indicateur === "Humidité"
      ? DiseaseEnum.FREQ_HUMIDITE
      : nom_indicateur === "Précipitations"
      ? DiseaseEnum.NB_PRECIPITATIONS
      : nom_indicateur === "Température maximum"
      ? DiseaseEnum.NB_TEMPERATURE_MAX
      : "";

  // Data map
  const dataMap = new Map<string, { sum: number; count: number }>();

  widgetGraphique?.observations.forEach(obs => {
    const obsDate = new Date(obs.timestamp as Date);
    const dateKey = obsDate.toISOString().split("T")[0]; // Use only the date part as key

    // Nb feuilles
    if (
      disease === DiseaseEnum.NB_FEUILLES &&
      obs.data.nb_feuilles &&
      obs.data.nb_feuilles !== undefined &&
      obs.data.nb_feuilles !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += +obs.data.nb_feuilles;
        entry.count += 1;
      }
    }

    // Fréquence rouille
    if (
      disease === DiseaseEnum.FREQ_ROUILLE &&
      obs.data.rouille &&
      obs.data.rouille.freq !== undefined &&
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

    // Intensité rouille
    if (
      disease === DiseaseEnum.INT_ROUILLE &&
      obs.data.rouille &&
      obs.data.rouille.int !== undefined &&
      obs.data.rouille.int !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += obs.data.rouille.int;
        entry.count += 1;
      }
    }

    // Fréquence écidies
    if (
      disease === DiseaseEnum.FREQ_ECIDISES &&
      obs.data.ecidies &&
      obs.data.ecidies.freq !== undefined &&
      obs.data.ecidies.freq !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += obs.data.ecidies.freq;
        entry.count += 1;
      }
    }

    // Fréquence téléutos
    if (
      disease === DiseaseEnum.FREQ_TELEUTOS &&
      obs.data.teleutos &&
      obs.data.teleutos.freq !== undefined &&
      obs.data.teleutos.freq !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += obs.data.teleutos.freq;
        entry.count += 1;
      }
    }

    // Fréquence urédos
    if (
      disease === DiseaseEnum.FREQ_UREDOS &&
      obs.data.uredos &&
      obs.data.uredos.freq !== undefined &&
      obs.data.uredos.freq !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += obs.data.uredos.freq;
        entry.count += 1;
      }
    }

    // Fréquence marsonia
    if (
      disease === DiseaseEnum.FREQ_MARSONIA &&
      obs.data.marsonia &&
      obs.data.marsonia.freq !== undefined &&
      obs.data.marsonia.freq !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += obs.data.marsonia.freq;
        entry.count += 1;
      }
    }

    // Nb Humectation foliaire
    if (
      disease === DiseaseEnum.NB_HUMECTATION_FOLIAIRE &&
      obs.data.humectation_foliaire &&
      obs.data.humectation_foliaire.nb !== undefined &&
      obs.data.humectation_foliaire.nb !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += +obs.data.humectation_foliaire.nb;
        entry.count += 1;
      }
    }

    // Fréquence Humidité
    if (
      disease === DiseaseEnum.FREQ_HUMIDITE &&
      obs.data.humidite &&
      obs.data.humidite.freq !== undefined &&
      obs.data.humidite.freq !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += +obs.data.humidite.freq;
        entry.count += 1;
      }
    }

    // Nb Précipitations
    if (
      disease === DiseaseEnum.NB_PRECIPITATIONS &&
      obs.data.precipitations &&
      obs.data.precipitations.nb !== undefined &&
      obs.data.precipitations.nb !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += +obs.data.precipitations.nb;
        entry.count += 1;
      }
    }

    // Nb Température maximum
    if (
      disease === DiseaseEnum.NB_TEMPERATURE_MAX &&
      obs.data.temperature_max &&
      obs.data.temperature_max.nb !== undefined &&
      obs.data.temperature_max.nb !== null
    ) {
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { sum: 0, count: 0 });
      }

      const entry = dataMap.get(dateKey);
      if (entry) {
        entry.sum += +obs.data.temperature_max.nb;
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
    id: `${indicator?.nom}`,
    id_widget: widgetGraphique?.widget.id as number,
    id_indicator: indicator?.id as number,
    color: indicateur.couleur,
    data: averagedData
      .sort((a, b) => a.x.getTime() - b.x.getTime())
      .filter(d => d.y != null)
      .filter(d => d != undefined),
  };
};
