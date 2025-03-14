"use server";

import dayjs from "dayjs";
import { db } from "@/app/lib/db";
import { Observation } from "@/app/models/interfaces/Observation";
import { PeriodReversedTypeEnum } from "@/app/models/enums/PeriodTypeEnum";
import { WidgetParams } from "@/app/models/interfaces/Widget";

const getObservationsByPeriod = async (
  explID?: number | null,
  dashboardID?: number | null,
  dateRange?: [Date | null, Date | null] | null,
  dateModeAuto?: string | null,
  checkedDateModeAuto?: boolean,
  plotID?: number | null,
  widgetID?: number | null
) => {
  try {
    if (!explID || !dashboardID) {
      return {
        success: false,
      };
    }

    const exploitations = await db.exploitations.findUnique({
      where: {
        id: +explID,
      },
      include: {
        Parcelles: {
          where: {
            id: plotID ? +plotID : undefined,
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

    const widget = await db.widgets.findUnique({
      where: {
        id: widgetID ? +widgetID : undefined,
      },
    });
    const indicatorIDs = (widget?.params as WidgetParams)?.indicateurs?.map(
      indicateur => indicateur.id
    );
    const indicators = await db.indicateurs.findMany({
      where: {
        id: {
          in: indicatorIDs,
        },
      },
    });
    const indicatorNames = indicators?.map(indicator => indicator.nom);

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

      // Get frequency & intensity
      // freqDataMap map
      const freqDataMap = new Map<string, { sum: number; count: number }>();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const freqs = observationsByDateRange.flatMap(obs => {
        const obsDate = new Date(obs.timestamp as Date);
        const dateKey = obsDate.toISOString().split("T")[0]; // Use only the date part as key

        // Fréquence rouille
        if (
          indicatorNames?.includes("Fréquence rouille") &&
          obs.data.rouille &&
          obs.data.rouille.freq !== undefined &&
          obs.data.rouille.freq !== null
        ) {
          if (!freqDataMap.has(dateKey)) {
            freqDataMap.set(dateKey, { sum: 0, count: 0 });
          }

          const entry = freqDataMap.get(dateKey);
          if (entry) {
            entry.sum += obs.data.rouille.freq;
            entry.count += 1;
          }
        }

        // Intensité rouille
        if (
          indicatorNames?.includes("Intensité rouille") &&
          obs.data.rouille &&
          obs.data.rouille.int !== undefined &&
          obs.data.rouille.int !== null
        ) {
          if (!freqDataMap.has(dateKey)) {
            freqDataMap.set(dateKey, { sum: 0, count: 0 });
          }

          const entry = freqDataMap.get(dateKey);
          if (entry) {
            entry.sum += obs.data.rouille.int;
            entry.count += 1;
          }
        }

        // Fréquence écidies
        if (
          indicatorNames?.includes("Fréquence écidies") &&
          obs.data.ecidies &&
          obs.data.ecidies.freq !== undefined &&
          obs.data.ecidies.freq !== null
        ) {
          if (!freqDataMap.has(dateKey)) {
            freqDataMap.set(dateKey, { sum: 0, count: 0 });
          }

          const entry = freqDataMap.get(dateKey);
          if (entry) {
            entry.sum += obs.data.ecidies.freq;
            entry.count += 1;
          }
        }

        // Fréquence téléutos
        if (
          indicatorNames?.includes("Fréquence téléutos") &&
          obs.data.teleutos &&
          obs.data.teleutos.freq !== undefined &&
          obs.data.teleutos.freq !== null
        ) {
          if (!freqDataMap.has(dateKey)) {
            freqDataMap.set(dateKey, { sum: 0, count: 0 });
          }

          const entry = freqDataMap.get(dateKey);
          if (entry) {
            entry.sum += obs.data.teleutos.freq;
            entry.count += 1;
          }
        }

        // Fréquence urédos
        if (
          indicatorNames?.includes("Fréquence urédos") &&
          obs.data.uredos &&
          obs.data.uredos.freq !== undefined &&
          obs.data.uredos.freq !== null
        ) {
          if (!freqDataMap.has(dateKey)) {
            freqDataMap.set(dateKey, { sum: 0, count: 0 });
          }

          const entry = freqDataMap.get(dateKey);
          if (entry) {
            entry.sum += obs.data.uredos.freq;
            entry.count += 1;
          }
        }

        // Fréquence marsonia
        if (
          indicatorNames?.includes("Fréquence marsonia") &&
          obs.data.marsonia &&
          obs.data.marsonia.freq !== undefined &&
          obs.data.marsonia.freq !== null
        ) {
          if (!freqDataMap.has(dateKey)) {
            freqDataMap.set(dateKey, { sum: 0, count: 0 });
          }

          const entry = freqDataMap.get(dateKey);
          if (entry) {
            entry.sum += obs.data.marsonia.freq;
            entry.count += 1;
          }
        }

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

      // const minFreq = standardDeviationRound(Math.min(...freqs));
      // const maxFreq = standardDeviationRound(Math.max(...freqs));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const averagedFreqData = Array.from(freqDataMap.entries())
        .map(([date, { sum, count }]) => ({
          x: new Date(date),
          y: Math.round((sum / count) * 100) / 100,
        }))
        .sort((a, b) => a.x.getTime() - b.x.getTime())
        .filter(d => d.y != null)
        .filter(d => d != undefined)
        .map(d => d.y);

      const minFreq = standardDeviationRound(Math.min(...averagedFreqData));
      const maxFreq = standardDeviationRound(Math.max(...averagedFreqData));

      // Get "Nombre de feuilles"
      // nbFeuillesDataMap map
      const nbFeuillesDataMap = new Map<
        string,
        { sum: number; count: number }
      >();
      observationsByDateRange.forEach(obs => {
        const obsDate = new Date(obs.timestamp as Date);
        const dateKey = obsDate.toISOString().split("T")[0]; // Use only the date part as key

        // Nb feuilles
        if (
          indicatorNames?.includes("Nombre de feuilles") &&
          obs.data.nb_feuilles &&
          obs.data.nb_feuilles !== undefined &&
          obs.data.nb_feuilles !== null
        ) {
          if (!nbFeuillesDataMap.has(dateKey)) {
            nbFeuillesDataMap.set(dateKey, { sum: 0, count: 0 });
          }

          const entry = nbFeuillesDataMap.get(dateKey);
          if (entry) {
            entry.sum += +obs.data.nb_feuilles;
            entry.count += 1;
          }
        }

        // const nbFeuilles = [obs.data.nb_feuilles ?? 0].filter(
        //   Boolean
        // ) as number[];
        // return nbFeuilles;
      });

      const averagedNbFeuillesData = Array.from(nbFeuillesDataMap.entries())
        .map(([date, { sum, count }]) => ({
          x: new Date(date),
          y: Math.round((sum / count) * 100) / 100,
        }))
        .sort((a, b) => a.x.getTime() - b.x.getTime())
        .filter(d => d.y != null)
        .filter(d => d != undefined)
        .map(d => d.y);

      const minNbFeuilles = standardDeviationRound(
        Math.min(...averagedNbFeuillesData)
      );
      const maxNbFeuilles = standardDeviationRound(
        Math.max(...averagedNbFeuillesData)
      );

      return {
        success: true,
        // Axe "Fréquence et intensité (%)"
        fromToAxe: {
          min: minFreq,
          max: maxFreq,
        },
        // Axe "Nombre de feuilles"
        nombreDeFeuillesAxe: {
          min: minNbFeuilles,
          max: maxNbFeuilles,
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

      // Data map
      const dataMap = new Map<string, { sum: number; count: number }>();

      // Get frequency & intensity from all diseases
      observationsByDateModeAuto.forEach(obs => {
        const obsDate = new Date(obs.timestamp as Date);
        const dateKey = obsDate.toISOString().split("T")[0]; // Use only the date part as key

        // Fréquence rouille
        if (
          indicatorNames?.includes("Fréquence rouille") &&
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
          indicatorNames?.includes("Intensité rouille") &&
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
          indicatorNames?.includes("Fréquence écidies") &&
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
          indicatorNames?.includes("Fréquence téléutos") &&
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
          indicatorNames?.includes("Fréquence urédos") &&
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
          indicatorNames?.includes("Fréquence marsonia") &&
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

        // const frequencies = [
        //   obs.data.ecidies?.freq ?? 0,
        //   obs.data.marsonia?.freq ?? 0,
        //   obs.data.rouille?.freq ?? 0,
        //   obs.data.teleutos?.freq ?? 0,
        //   obs.data.uredos?.freq ?? 0,
        //   obs.data.rouille?.int ?? 0,
        // ].filter(Boolean) as number[];
        // return frequencies;
      });

      const averagedData = Array.from(dataMap.entries())
        .map(([date, { sum, count }]) => ({
          x: new Date(date),
          y: Math.round((sum / count) * 100) / 100,
        }))
        .sort((a, b) => a.x.getTime() - b.x.getTime())
        .filter(d => d.y != null)
        .filter(d => d != undefined)
        .map(d => d.y);

      console.log("averagedData :", averagedData);

      const minFreq = standardDeviationRound(Math.min(...averagedData));
      const maxFreq = standardDeviationRound(Math.max(...averagedData));

      // Get "Nombre de feuilles"
      const nombreFeuilles = observationsByDateModeAuto.flatMap(obs => {
        const nbFeuilles = [obs.data.nb_feuilles ?? 0].filter(
          Boolean
        ) as number[];

        return nbFeuilles;
      });
      const minNbFeuilles = standardDeviationRound(Math.min(...nombreFeuilles));
      const maxNbFeuilles = standardDeviationRound(Math.max(...nombreFeuilles));

      return {
        success: true,
        // Axe "Fréquence et intensité (%)"
        fromToAxe: {
          min: minFreq,
          max: maxFreq,
        },
        // Axe "Nombre de feuilles"
        nombreDeFeuillesAxe: {
          min: minNbFeuilles,
          max: maxNbFeuilles,
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
