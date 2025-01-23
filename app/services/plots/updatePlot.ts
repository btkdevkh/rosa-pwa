import axios from "axios";
import { Parcelle } from "@/app/models/interfaces/Parcelle";

const updatePlot = async (plot: Parcelle) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plots`,
      plot
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default updatePlot;
