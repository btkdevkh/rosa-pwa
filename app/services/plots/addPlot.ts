import axios from "axios";
import { Parcelle } from "@/app/models/interfaces/Parcelle";

const addPlot = async (plot: Parcelle) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plots`,
      plot
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default addPlot;
