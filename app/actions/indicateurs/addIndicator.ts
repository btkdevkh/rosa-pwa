"use server";

import { db } from "../../lib/db";
import { Indicateur } from "@/app/models/interfaces/Indicateur";

const addIndicator = async (indicator: Indicateur) => {
  try {
    const addedIndicator = await db.indicateurs.create({
      data: indicator,
    });

    return {
      success: true,
      addedIndicator: addedIndicator,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default addIndicator;
