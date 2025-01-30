"use server";

import { db } from "@/app/lib/db";

const getGraphiques = async (explID: number, dashboardID: number) => {
  try {
    const graphiques = await db.widgets.findMany({
      where: {
        id_dashboard: dashboardID,
      },
      include: {
        Dashboards: {
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
    // @todo: filter observations by selected date range
    const observations = await db.observations.findMany({
      where: {
        id_rosier: { in: rosiersIds as number[] },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

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
