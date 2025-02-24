"use server";

import { db } from "@/app/lib/db";
import dayjs from "dayjs";
import { Observation } from "@/app/models/interfaces/Observation";
import { PeriodReversedTypeEnum } from "@/app/models/enums/PeriodTypeEnum";

const getObservationsByPeriod = async (
  explID?: number | null,
  dashboardID?: number | null,
  dateRange?: [Date | null, Date | null] | null,
  dateModeAuto?: string | null,
  checkedDateModeAuto?: boolean
) => {
  try {
    if (!explID || !dashboardID) {
      return {
        success: false,
      };
    }

    console.log("CHECKED DATE MODE AUTO :", checkedDateModeAuto);
    console.log("DATE MODE AUTO :", dateModeAuto);

    const exploitations = await db.exploitations.findUnique({
      where: {
        id: +explID,
      },
      include: {
        Parcelles: {
          where: {
            id_exploitation: +explID,
          },
          include: {
            Rosiers: {
              select: {
                Observations: {
                  orderBy: {
                    timestamp: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    const observations = exploitations?.Parcelles.flatMap(parcelle =>
      parcelle?.Rosiers?.flatMap(rosier => rosier?.Observations)
    );

    const filteredObservations = observations
      ?.map(observation => {
        if (observation) {
          if (observation.timestamp) {
            // Date observation
            const obsDate = new Date(observation.timestamp);

            // Toutes les observations
            return {
              ...observation,
              timestamp: obsDate,
            };
          }
        }

        return null;
      })
      .filter(Boolean);

    // Date manuelle
    if (
      !checkedDateModeAuto &&
      dateRange?.[0] &&
      dateRange?.[1] &&
      filteredObservations &&
      filteredObservations.length > 0
    ) {
      const observationsByDateRange = filterObservationsByDateRange(
        dateRange[0], // start date
        dateRange[1], // end date
        filteredObservations as Observation[]
      );

      // Get frequency & intensity from all diseases
      const frequencies = observationsByDateRange.flatMap(obs => {
        const frequencies = [
          obs.data.ecidies?.freq ?? 0,
          obs.data.marsonia?.freq ?? 0,
          obs.data.rouille?.freq ?? 0,
          obs.data.teleutos?.freq ?? 0,
          obs.data.uredos?.freq ?? 0,
          obs.data.rouille?.int ?? 0,
        ].filter(Boolean) as number[];

        return frequencies;
      });

      const min = standardDeviationRound(Math.min(...frequencies));
      const max = standardDeviationRound(Math.max(...frequencies));

      const nombreFeuilles = observationsByDateRange.flatMap(obs => {
        const numLeaves = [obs.data.nb_feuilles ?? 0].filter(
          Boolean
        ) as number[];

        return numLeaves;
      });

      const minLeaves = standardDeviationRound(Math.min(...nombreFeuilles));
      const maxLeaves = standardDeviationRound(Math.max(...nombreFeuilles));

      return {
        success: true,
        freqInt: {
          min,
          max,
        },
        nbFeuille: {
          min: minLeaves,
          max: maxLeaves,
        },
      };
    }

    // Date auto
    if (
      checkedDateModeAuto &&
      dateModeAuto &&
      filteredObservations &&
      filteredObservations.length > 0
    ) {
      const observationsByDateModeAuto = filterObservationsByDateModeAuto(
        dateModeAuto,
        filteredObservations as Observation[]
      );

      // Get frequency & intensity from all diseases
      const frequencies = observationsByDateModeAuto.flatMap(obs => {
        const frequencies = [
          obs.data.ecidies?.freq ?? 0,
          obs.data.marsonia?.freq ?? 0,
          obs.data.rouille?.freq ?? 0,
          obs.data.teleutos?.freq ?? 0,
          obs.data.uredos?.freq ?? 0,
          obs.data.rouille?.int ?? 0,
        ].filter(Boolean) as number[];

        return frequencies;
      });
      const minFreq = standardDeviationRound(Math.min(...frequencies));
      const maxFreq = standardDeviationRound(Math.max(...frequencies));

      const nombreFeuilles = observationsByDateModeAuto.flatMap(obs => {
        const numLeaves = [obs.data.nb_feuilles ?? 0].filter(
          Boolean
        ) as number[];

        return numLeaves;
      });
      const minLeaves = standardDeviationRound(Math.min(...nombreFeuilles));
      const maxLeaves = standardDeviationRound(Math.max(...nombreFeuilles));

      return {
        success: true,
        freqInt: {
          min: minFreq,
          max: maxFreq,
        },
        nbFeuille: {
          min: minLeaves,
          max: maxLeaves,
        },
      };
    }
  } catch (error) {
    console.log("Error :", error);
    return {
      error,
      success: false,
    };
  }
};

export default getObservationsByPeriod;

// Helpers
const filterObservationsByDateRange = (
  startDate: Date,
  endDate: Date,
  observations: Observation[]
) => {
  const formatStartDate = dayjs(startDate).format();
  const formatEndDate = dayjs(endDate).format();

  // Sort observations in "desc"
  const descObservations = observations.sort(
    (a, b) =>
      new Date(b.timestamp ?? "").getTime() -
      new Date(a.timestamp ?? "").getTime()
  );

  if (startDate && endDate) {
    const filteredObservations = descObservations.filter(obs => {
      if (obs.timestamp) {
        const obsDate = dayjs(obs.timestamp).format();
        const formatObsDate = `${obsDate.split("T")[0]}T00:00:00+01:00`;
        return (
          formatObsDate >= formatStartDate && formatObsDate <= formatEndDate
        );
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

const standardDeviationRound = (value: number): number => {
  // Check is value is Infinity, -Infinity, NaN or not a number
  if (value == null || isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  const integerPart = Math.trunc(value); // Get integer part safely
  const decimalPart = value - integerPart; // Extract decimal part

  return decimalPart >= 0.5 ? integerPart + 1 : integerPart;
};
