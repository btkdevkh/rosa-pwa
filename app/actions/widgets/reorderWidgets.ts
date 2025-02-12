"use server";

import { db } from "@/app/lib/db";
import { Widget } from "@/app/models/interfaces/Widget";

const reorderWidgets = async (widgetData: Widget[]) => {
  try {
    if (widgetData && widgetData.length > 0) {
      for (const widget of widgetData) {
        await db.widgets.update({
          where: {
            id: widget.id,
            id_dashboard: widget.id_dashboard,
          },
          data: widget,
        });
      }

      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default reorderWidgets;
