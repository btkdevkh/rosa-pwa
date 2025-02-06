"use server";

import { db } from "@/app/lib/db";

const getWidget = async (widgetID: number) => {
  try {
    const widget = await db.widgets.findUnique({
      where: {
        id: +widgetID,
      },
    });

    if (!widget) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      widget: widget,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      error,
      success: false,
    };
  }
};

export default getWidget;
