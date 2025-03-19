"use server";

import dayjs from "dayjs";
import { db } from "@/app/lib/db";
import { Observation } from "@/app/models/interfaces/Observation";

const getObservationsByPeriodDownload = async (
  explID?: number | null,
  dateRange?: [Date | null, Date | null] | null,
  downloadArchivedData?: boolean
) => {
  try {
    if (!explID) {
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
            id_exploitation: +explID,
          },
          include: {
            Rosiers: {
              select: {
                nom: true,
                est_archive: true,
                hauteur: true,
                position: true,
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

    const observations = exploitations?.Parcelles.flatMap(parcelle => {
      if (downloadArchivedData && downloadArchivedData === true) {
        return parcelle?.Rosiers.flatMap(rosier => {
          return rosier.Observations.map(obs => ({
            ...obs,
            plotName: parcelle.nom,
            rosierName: rosier.nom,
            hauteur: rosier.hauteur,
            position: rosier.position,
            est_archive: parcelle.est_archive ? true : false,
          }));
        });
      } else {
        return parcelle?.Rosiers.flatMap(rosier => {
          return rosier.Observations.map(obs => ({
            ...obs,
            plotName: parcelle.nom,
            rosierName: rosier.nom,
            hauteur: rosier.hauteur,
            position: rosier.position,
            est_archive: parcelle.est_archive ? true : false,
          })).filter(obs => !obs.est_archive);
        });
      }
    });

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

      return {
        success: true,
        observations: observationsByDateRange,
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

export default getObservationsByPeriodDownload;

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
