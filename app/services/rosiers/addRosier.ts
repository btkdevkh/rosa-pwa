import axios from "axios";
import { Rosier } from "@/app/models/interfaces/Rosier";

const addRosier = async (rosier: Rosier) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers`,
      rosier
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default addRosier;
