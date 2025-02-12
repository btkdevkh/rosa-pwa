"use server";

import { db } from "../../lib/db";
import { Axe } from "@/app/models/interfaces/Axe";

const addAxe = async (axe: Axe) => {
  try {
    const addedAxe = await db.axes.create({
      data: axe,
    });

    return {
      success: true,
      addedAxe: addedAxe,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default addAxe;
