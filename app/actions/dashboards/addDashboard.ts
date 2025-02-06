"use server";

import { db } from "../../lib/db";
import { Dashboard } from "../../models/interfaces/Dashboard";

const addDashboard = async (dashboard: Dashboard) => {
  try {
    const addedDashboard = await db.dashboards.create({
      data: dashboard,
    });

    return {
      success: true,
      addedDashboard: addedDashboard,
    };
  } catch (error) {
    console.log("Error :", error);

    return {
      success: false,
      error,
    };
  }
};

export default addDashboard;
