"use server";

import { db } from "@/app/lib/db";
import { WidgetParams } from "@/app/models/interfaces/Widget";

const getGraphiques = async (explID: number, dashboardID: number) => {
  try {
    const graphiques = await db.widgets.findMany({
      where: {
        id_dashboard: dashboardID,
      },
      include: {
        Dashboards: {
          where: {
            id_exploitation: explID,
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

    // @todo: filter observations by selected date range
    const filteredObservations = observations.filter(observation => {
      console.log("OBS timestamp :", observation.timestamp);

      for (const graphique of graphiques) {
        const params = graphique.params as WidgetParams;
        console.log("date_auto :", params.date_auto);
        console.log("mode_date_auto :", params.mode_date_auto);
        console.log("date_debut_manuelle :", params.date_debut_manuelle);
        console.log("date_fin_manuelle :", params.date_fin_manuelle);
        console.log("--------------------------------------------------");
      }
    });
    console.log("filteredObservations :", filteredObservations);

    return {
      success: true,
      graphiques,
      observations: observations.length > 0 ? observations : [],
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default getGraphiques;
