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

      // DATE MANUELLE
      if (!date_auto && date_debut_manuelle && date_fin_manuelle) {
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
        });
      }
    }

    return results;
  } catch (error) {
    console.log("Error :", error);

    return {
      error,
    };
  }
};

export default getGraphiques;

// Helpers
// Func to filter "Date manuelle"
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

  return []; // Return empty array if dates are not provided
};

// Func to filter "Date auto"
const filterObservationsByDateModeAuto = (
  dateModeAuto: string,
  observations: Observation[]
) => {
  const descObservations = observations.sort((a, b) =>
    new Date(b.timestamp ?? "")
      .toLocaleString()
      .localeCompare(new Date(a.timestamp ?? "").toLocaleString())
  );

  // Determine the date of the last observation
  const lastObservationDate = new Date(descObservations[0]?.timestamp ?? "");

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
      case PeriodReversedTypeEnum.LAST_8D: {
        const last8DaysStart = new Date(lastObservationDate);
        last8DaysStart.setDate(lastObservationDate.getDate() - 8);
        return filterByDateRange(last8DaysStart, lastObservationDate);
      }

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

      case PeriodReversedTypeEnum.LAST_30D: {
        const last30DaysStart = new Date(lastObservationDate);
        last30DaysStart.setDate(lastObservationDate.getDate() - 30);
        return filterByDateRange(last30DaysStart, lastObservationDate);
      }

      case PeriodReversedTypeEnum._8D_AFTER: {
        const next8DaysStart = new Date(lastObservationDate);
        next8DaysStart.setDate(lastObservationDate.getDate() + 1);

        const next8DaysEnd = new Date(next8DaysStart);
        next8DaysEnd.setDate(next8DaysStart.getDate() + 7);

        return filterByDateRange(next8DaysStart, next8DaysEnd);
      }

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

      case PeriodReversedTypeEnum.THIS_YEAR: {
        const thisYearStart = new Date(lastObservationDate.getFullYear(), 0, 1);
        const thisYearEnd = new Date(lastObservationDate.getFullYear(), 11, 31);
        return filterByDateRange(thisYearStart, thisYearEnd);
      }

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

      case PeriodReversedTypeEnum.LAST_WEEK: {
        const lastWeekEnd = new Date(lastObservationDate);
        lastWeekEnd.setDate(
          lastObservationDate.getDate() - lastObservationDate.getDay()
        );

        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 7);

        return filterByDateRange(lastWeekStart, lastWeekEnd);
      }

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

/*
// Func to filter "Date auto"
const filterObservationsByDateModeAuto = (
  dateModeAuto: string,
  observations: Observation[]
) => {
  const descObservations = observations.sort((a, b) =>
    new Date(b.timestamp ?? "")
      .toLocaleString()
      .localeCompare(new Date(a.timestamp ?? "").toLocaleString())
  );

  // Déterminer la date de la dernière observation
  const lastObservationDate = new Date(descObservations[0].timestamp ?? "");

  // LAST_8D
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_8D
  ) {
    // Définir la plage des 8 derniers jours avant cette date
    const last8DaysStart = new Date(lastObservationDate);
    last8DaysStart.setDate(lastObservationDate.getDate() - 8);

    return descObservations.filter(obs => {
      if (obs.timestamp) {
        const obsDate = new Date(obs.timestamp);
        return obsDate >= last8DaysStart && obsDate <= lastObservationDate;
      }

      return [];
    });
  }

  // LAST_8D_AFTER
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_8D_AFTER
  ) {
    // Définir la plage des 8 derniers jours avant cette date
    const last8DaysStart = new Date(lastObservationDate);
    last8DaysStart.setDate(lastObservationDate.getDate() - 8);

    // Définir la plage des 8 prochains jours après cette date
    const next8DaysStart = new Date(lastObservationDate);
    next8DaysStart.setDate(lastObservationDate.getDate() + 1);

    const next8DaysEnd = new Date(next8DaysStart);
    next8DaysEnd.setDate(next8DaysStart.getDate() + 7);

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

  // @todo
  // LAST_30D
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_30D
  ) {
    return [];
  }

  // @todo
  // _8D_AFTER
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum._8D_AFTER
  ) {
    return [];
  }

  // @todo
  // LAST_YEAR
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_YEAR
  ) {
    return [];
  }

  // @todo
  // THIS_YEAR
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.THIS_YEAR
  ) {
    return [];
  }

  // @todo
  // LAST_MONTH
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_MONTH
  ) {
    return [];
  }

  // @todo
  // THIS_MONTH
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.THIS_MONTH
  ) {
    return [];
  }

  // @todo
  // LAST_WEEK
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.LAST_WEEK
  ) {
    return [];
  }

  // @todo
  // THIS_WEEK
  if (
    dateModeAuto.length > 0 &&
    dateModeAuto === PeriodReversedTypeEnum.THIS_WEEK
  ) {
    return [];
  }
};
*/

const dernierJourDuMois = (mois: number, annee: number) => {
  return new Date(annee, mois, 0).getDate();
};
