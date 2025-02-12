"use server";

import { db } from "../../lib/db";

const getAxes = async () => {
  try {
    const axes = await db.axes.findMany();

    return {
      success: true,
      axes: axes,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default getAxes;
