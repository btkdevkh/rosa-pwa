"use server";

import { db } from "@/app/lib/db";

const getOnlyWidgets = async (dashboardID: number) => {
  try {
    const widgets = await db.widgets.findMany({
      where: {
        id_dashboard: +dashboardID,
      },
    });

    if (widgets.length === 0) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      widgets: widgets,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      error,
      success: false,
    };
  }
};

export default getOnlyWidgets;
