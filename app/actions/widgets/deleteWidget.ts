"use server";

import { db } from "@/app/lib/db";

const deleteWidget = async (widgetID: number) => {
  try {
    const deletedWidget = await db.widgets.delete({
      where: {
        id: +widgetID,
      },
    });

    return {
      success: true,
      deletedWidget: deletedWidget,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default deleteWidget;
