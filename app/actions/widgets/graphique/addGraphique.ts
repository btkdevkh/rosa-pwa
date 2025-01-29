"use server";

import { db } from "@/app/lib/db";
import { Widget } from "@/app/models/interfaces/Widget";

const addGraphique = async (widgetData: Widget) => {
  try {
    const addedGraphique = await db.widgets.create({
      data: widgetData,
    });

    return {
      success: true,
      addedGraphique: addedGraphique,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default addGraphique;
