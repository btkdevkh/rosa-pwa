"use server";

import { db } from "@/app/lib/db";

const getPlotByID = async (plotID: number) => {
  try {
    const response = await db.parcelles.findUnique({ where: { id: plotID } });

    if (!response) {
      throw new Error("No plot found with this ID");
    }

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default getPlotByID;
