"use server";

import { db } from "@/app/lib/db";
import { Widget } from "@/app/models/interfaces/Widget";
import { Observation } from "@/app/models/interfaces/Observation";
import { PeriodReversedTypeEnum } from "@/app/models/enums/PeriodTypeEnum";
import { Indicateurs } from "@prisma/client";

const getWidgets = async (explID: number, dashboardID: number) => {
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

    // Fetch Indicateurs & Axes
    const indicateurs = await db.indicateurs.findMany({
      include: {
        Axes: true,
      },
    });

    const filteredObservations = observations
      .map(observation => {
        if (observation) {
          // Date observation
          const obsDate = new Date(observation.timestamp ?? "n/a");

          // Toutes les observations
          return {
            ...observation,
            // timestamp: obsDate.toISOString(),
            timestamp: new Date(obsDate),
          };

          // Toutes les observations de l'année en cours
          // const obsTime = obsDate.getTime();
          // const year = new Date().getFullYear();
          // const defaultStartDate = new Date(`${year}-01-01`).getTime();
          // const defaultEndDate = new Date(`${year}-12-31`).getTime();

          // if (obsTime >= defaultStartDate && obsTime <= defaultEndDate) {
          //   return {
          //     ...observation,
          //     timestamp: obsDate.toISOString(),
          //   };
          // }
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
    const results: {
      widget: Widget;
      observations: Observation[];
      indicateurs: Indicateurs[];
    }[] = [];

    for (const widgetGraphique of widgetGraphiques) {
      const {
        date_auto,
        mode_date_auto,
        date_debut_manuelle,
        date_fin_manuelle,
      } = widgetGraphique.params;

      // DATE MANUELLE
      if (!date_auto && date_debut_manuelle && date_fin_manuelle) {
        const observationsByDateRange = filterObservationsByDateRange(
          date_debut_manuelle,
          date_fin_manuelle,
          filteredObservations as unknown as Observation[]
        );

        console.log("observationsByDateRange :", observationsByDateRange);

        results.push({
          widget: widgetGraphique,
          observations: observationsByDateRange ?? [],
          indicateurs: indicateurs.length > 0 ? indicateurs : [],
        });
      }

      // DATE AUTO
      if (
        !date_debut_manuelle &&
        !date_fin_manuelle &&
        date_auto &&
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
          indicateurs: indicateurs.length > 0 ? indicateurs : [],
        });
      }
    }

    return results;
  } catch (error) {
    console.log("Error :", error);

    return {
      error,
      success: false,
    };
  }
};

export default getWidgets;

// Helpers
const filterObservationsByDateRange = (
  startDate: Date,
  endDate: Date,
  observations: Observation[]
) => {
  const formatStartDate = new Date(startDate);
  const formatEndDate = new Date(endDate);

  // Convert startDate and endDate to UTC
  const utcStartDate = new Date(
    Date.UTC(
      formatStartDate.getFullYear(),
      formatStartDate.getMonth(),
      formatStartDate.getDate(),
      0,
      0,
      0,
      0 // Start of day in UTC
    )
  );

  const utcEndDate = new Date(
    Date.UTC(
      formatEndDate.getFullYear(),
      formatEndDate.getMonth(),
      formatEndDate.getDate(),
      23,
      59,
      59,
      999 // End of day in UTC
    )
  );

  // Sort observations in descending order
  const descObservations = observations.sort(
    (a, b) =>
      new Date(b.timestamp ?? "").getTime() -
      new Date(a.timestamp ?? "").getTime()
  );

  if (startDate && endDate) {
    const filteredObservations = descObservations.filter(obs => {
      if (obs.timestamp) {
        const obsDate = new Date(obs.timestamp);
        return obsDate >= utcStartDate && obsDate <= utcEndDate;
      }
      return false;
    });

    return filteredObservations;
  }

  return [];
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

  // Si on ne veut que :
  // La dernière date d'observation
  // const lastObservationDate = new Date(descObservations[0]?.timestamp ?? "");

  // Si on ne veut que :
  // La date d'aujourd'hui
  const lastObservationDate = new Date();

  const filterByDateRange = (startDate: Date, endDate: Date) => {
    return descObservations.filter(obs => {
      if (obs.timestamp) {
        const obsDate = new Date(obs.timestamp);
        return obsDate >= startDate && obsDate <= endDate;
      }
      return false;
    });
  };

  if (dateModeAuto.length > 0) {
    switch (dateModeAuto) {
      // 30 derniers jours
      case PeriodReversedTypeEnum.LAST_30D: {
        const last30DaysStart = new Date(lastObservationDate);
        last30DaysStart.setDate(lastObservationDate.getDate() - 30);
        return filterByDateRange(last30DaysStart, lastObservationDate);
      }

      // 8 derniers jours
      case PeriodReversedTypeEnum.LAST_8D: {
        const last8DaysStart = new Date(lastObservationDate);
        last8DaysStart.setDate(lastObservationDate.getDate() - 8);
        return filterByDateRange(last8DaysStart, lastObservationDate);
      }

      // 8 derniers jours et 8 prochains jours
      case PeriodReversedTypeEnum.LAST_8D_AFTER: {
        const last8DaysStart = new Date(lastObservationDate);
        last8DaysStart.setDate(lastObservationDate.getDate() - 8);

        const next8DaysStart = new Date(lastObservationDate);
        next8DaysStart.setDate(lastObservationDate.getDate() + 1);

        const next8DaysEnd = new Date(next8DaysStart);
        next8DaysEnd.setDate(next8DaysStart.getDate() + 7);

        const last8DaysObservations = filterByDateRange(
          last8DaysStart,
          lastObservationDate
        );
        const next8DaysObservations = filterByDateRange(
          next8DaysStart,
          next8DaysEnd
        );

        return [...last8DaysObservations, ...next8DaysObservations];
      }

      // 8 prochains jours
      case PeriodReversedTypeEnum._8D_AFTER: {
        const next8DaysStart = new Date(lastObservationDate);
        next8DaysStart.setDate(lastObservationDate.getDate() + 1);

        const next8DaysEnd = new Date(next8DaysStart);
        next8DaysEnd.setDate(next8DaysStart.getDate() + 7);

        return filterByDateRange(next8DaysStart, next8DaysEnd);
      }

      // Année dernière
      case PeriodReversedTypeEnum.LAST_YEAR: {
        const lastYearStart = new Date(
          lastObservationDate.getFullYear() - 1,
          0,
          1
        );
        const lastYearEnd = new Date(
          lastObservationDate.getFullYear() - 1,
          11,
          31
        );

        return filterByDateRange(lastYearStart, lastYearEnd);
      }

      // Année en cours
      case PeriodReversedTypeEnum.THIS_YEAR: {
        const thisYearStart = new Date(lastObservationDate.getFullYear(), 0, 1);
        const thisYearEnd = new Date(lastObservationDate.getFullYear(), 11, 31);
        return filterByDateRange(thisYearStart, thisYearEnd);
      }

      // Mois dernier
      case PeriodReversedTypeEnum.LAST_MONTH: {
        const lastMonth = new Date(
          lastObservationDate.getFullYear(),
          lastObservationDate.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(
          lastObservationDate.getFullYear(),
          lastObservationDate.getMonth(),
          0
        );
        return filterByDateRange(lastMonth, lastMonthEnd);
      }

      // Mois en cours
      case PeriodReversedTypeEnum.THIS_MONTH: {
        const thisMonthStart = new Date(
          lastObservationDate.getFullYear(),
          lastObservationDate.getMonth(),
          1
        );
        const thisMonthEnd = new Date(
          lastObservationDate.getFullYear(),
          lastObservationDate.getMonth() + 1,
          0
        );
        return filterByDateRange(thisMonthStart, thisMonthEnd);
      }

      // Semaine dernière
      case PeriodReversedTypeEnum.LAST_WEEK: {
        const lastWeekEnd = new Date(lastObservationDate);
        lastWeekEnd.setDate(
          lastObservationDate.getDate() - lastObservationDate.getDay()
        );

        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 7);

        return filterByDateRange(lastWeekStart, lastWeekEnd);
      }

      // Semaine en cours
      case PeriodReversedTypeEnum.THIS_WEEK: {
        const thisWeekStart = new Date(lastObservationDate);
        thisWeekStart.setDate(
          lastObservationDate.getDate() - lastObservationDate.getDay()
        );

        const thisWeekEnd = new Date(thisWeekStart);
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

        return filterByDateRange(thisWeekStart, thisWeekEnd);
      }

      default:
        return [];
    }
  }

  return [];
};
