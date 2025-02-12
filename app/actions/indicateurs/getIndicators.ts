"use server";

import { db } from "../../lib/db";

const getIndicators = async () => {
  try {
    const indicators = await db.indicateurs.findMany();

    return {
      success: true,
      indicators: indicators,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default getIndicators;
