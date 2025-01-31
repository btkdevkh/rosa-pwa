"use server";

import { db } from "@/app/lib/db";
import { Widget } from "@/app/models/interfaces/Widget";
import { Observation } from "@/app/models/interfaces/Observation";
import { PeriodReversedTypeEnum } from "@/app/models/enums/PeriodTypeEnum";

const getGraphiques = async (explID: number, dashboardID: number) => {
  try {
    const graphiques = await db.widgets.findMany({
      where: {
        id_dashboard: +dashboardID,
      },
      include: {
        Dashboards: {
          where: {
            id_exploitation: +explID,
          },
          include: {
            Exploitations: {
              include: {
                Parcelles: {
                  include: {
                    Rosiers: true, // Fetch Rosiers without Observations
                  },
                },
              },
            },
          },
        },
      },
    });

    const rosiersIds = graphiques.flatMap(widget =>
      widget?.Dashboards?.Exploitations?.Parcelles.flatMap(parcelle =>
        parcelle.Rosiers.map(rosier => rosier.id)
      )
    );

    // Fetch Observations separately
    const observations = await db.observations.findMany({
      where: {
        id_rosier: { in: rosiersIds as number[] },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    const filteredObservations = observations
      .map(observation => {
        if (observation) {
          // Date observation
          const obsDate = new Date(observation.timestamp ?? "n/a");
          const obsMonth = obsDate.getMonth() + 1;
          const obsYear = obsDate.getFullYear();
          const obsTime = obsDate.getTime();

          // Date par default
          const year = new Date().getFullYear();
          const defaultStartDate = new Date(`${year}-01-01`).getTime();
          const defaultEndDate = new Date(`${year}-12-31`).getTime();

          if (obsTime >= defaultStartDate && obsTime <= defaultEndDate) {
            return {
              ...observation,
              timestamp: obsDate.toISOString(),
              dernierJourDuMois: dernierJourDuMois(obsMonth, obsYear),
            };
          }
        }

        return null;
      })
      .filter(Boolean); // Remove nulls

    const widgetGraphiques = graphiques.map(
      graphique =>
        ({
          id: graphique.id,
          id_dashboard: graphique.id_dashboard,
          params: graphique.params,
          type: graphique.type,
        } as Widget)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: { widget: Widget; observations: Observation[] }[] = [];

    for (const widgetGraphique of widgetGraphiques) {
      const {
        date_auto,
        mode_date_auto,
        date_debut_manuelle,
        date_fin_manuelle,
      } = widgetGraphique.params;

      // Date auto
      if (date_auto && mode_date_auto === "") {
        const observationsByDateAuto = filterObservationsByDateAuto(
          widgetGraphique.params.date_auto,
          filteredObservations as unknown as Observation[]
        );

        results.push({
          widget: widgetGraphique,
          observations: observationsByDateAuto ?? [],
        });
      }

      // Date manuelle
      if (date_debut_manuelle && date_fin_manuelle) {
        const observationsByDateRange = filterObservationsByDateRange(
          date_debut_manuelle,
          date_fin_manuelle,
          filteredObservations as unknown as Observation[]
        );

        results.push({
          widget: widgetGraphique,
          observations: observationsByDateRange ?? [],
        });
      }

      // Date mode auto
      if (
        !date_auto &&
        !date_debut_manuelle &&
        !date_fin_manuelle &&
        mode_date_auto &&
        mode_date_auto.length > 0
      ) {
        const observationsByDateModeAuto = filterObservationsByDateModeAuto(
          mode_date_auto,
          filteredObservations as unknown as Observation[]
        );

        results.push({
          widget: widgetGraphique,
          observations: observationsByDateModeAuto ?? [],
        });
      }
    }

    return results;
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default getGraphiques;

// Helpers
const filterObservationsByDateAuto = (
  dateAuto: boolean,
  observations: Observation[]
) => {
  if (dateAuto == true) {
    return observations;
  }
};

const filterObservationsByDateRange = (
  startDate: Date,
  endDate: Date,
  observations: Observation[]
) => {
  const startDateLocaleString = startDate
    ? new Date(startDate).toLocaleString()
    : null;
  const endDateLocaleString = endDate
    ? new Date(endDate).toLocaleString()
    : null;
  // console.log("startDateLocaleString", startDateLocaleString);
  // console.log("endDateLocaleString", endDateLocaleString);

  if (startDateLocaleString && endDateLocaleString) {
    const filteredObservations = observations.filter(obs => {
      const obsDate = obs.timestamp
        ? new Date(obs.timestamp).toLocaleString()
        : null;
      // console.log("obsDate :", obsDate);

      if (
        obsDate &&
        startDateLocaleString &&
        endDateLocaleString &&
        obsDate.split(",")[0] >= startDateLocaleString.split(",")[0] &&
        obsDate.split(",")[0] <= endDateLocaleString.split(",")[0]
      ) {
        return true;
      }
    });

    return filteredObservations;
  }
};

const filterObservationsByDateModeAuto = (
  dateModeAuto: string,
  observations: Observation[]
) => {
  const descObservations = observations.sort((a, b) =>
    new Date(b.timestamp ?? "")
      .toLocaleString()
      .localeCompare(new Date(a.timestamp ?? "").toLocaleString())
  );
  // console.log("descObservations :", descObservations);

  // Déterminer la date de la dernière observation
  const lastObservationDate = new Date(descObservations[0].timestamp ?? "");

  // Définir la plage des 8 derniers jours avant cette date
  const last8DaysStart = new Date(lastObservationDate);
  last8DaysStart.setDate(lastObservationDate.getDate() - 8);

  // Définir la plage des 8 prochains jours après cette date
  const next8DaysStart = new Date(lastObservationDate);
  next8DaysStart.setDate(lastObservationDate.getDate() + 1);

  const next8DaysEnd = new Date(next8DaysStart);
  next8DaysEnd.setDate(next8DaysStart.getDate() + 7);

  // last_8d
  // "8 derniers jours" signifie les 8 jours qui précèdent aujourd’hui.
  // Par exemple, si on est le 31 janvier, cela couvre la période du 23 au 30 janvier.
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_8D
  ) {
    return descObservations.filter(obs => {
      if (obs.timestamp) {
        const obsDate = new Date(obs.timestamp);
        return obsDate >= last8DaysStart && obsDate <= lastObservationDate;
      }

      return [];
    });
  }

  // last_8d_after
  // "8 derniers jours" signifie les 8 jours qui précèdent aujourd’hui.
  // Par exemple, si on est le 31 janvier, cela couvre la période du 23 au 30 janvier.
  // "8 prochains jours" signifie les 8 jours qui suivent aujourd’hui.
  // Donc, si on est le 31 janvier, cela couvre la période du 1er au 8 février.
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_8D_AFTER
  ) {
    const last8DaysObservations = descObservations.filter(obs => {
      if (obs.timestamp) {
        const obsDate = new Date(obs.timestamp);
        return obsDate >= last8DaysStart && obsDate <= lastObservationDate;
      }

      return [];
    });

    const next8DaysObservations = descObservations.filter(obs => {
      if (obs.timestamp) {
        const obsDate = new Date(obs.timestamp);
        return obsDate >= next8DaysStart && obsDate <= next8DaysEnd;
      }

      return [];
    });

    return [...last8DaysObservations, ...next8DaysObservations];
  }
};

const dernierJourDuMois = (mois: number, annee: number) => {
  return new Date(annee, mois, 0).getDate();
};
