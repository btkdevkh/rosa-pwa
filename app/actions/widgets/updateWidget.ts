"use server";

import { db } from "@/app/lib/db";
import { Widget } from "@/app/models/interfaces/Widget";

const updateWidget = async (widgetData: Widget) => {
  try {
    const updatedGraphique = await db.widgets.update({
      where: {
        id: widgetData.id,
      },
      data: widgetData,
    });

    return {
      success: true,
      updatedGraphique: updatedGraphique,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default updateWidget;
