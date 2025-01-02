import axios from "axios";
import { Rosier } from "@/app/models/interfaces/Rosier";

const updateRosier = async (rosier: Rosier) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers`,
      rosier
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default updateRosier;
