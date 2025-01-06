import axios from "axios";
import { Observation } from "@/app/models/interfaces/Observation";

const addObservation = async (observation: Observation) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers/observations`,
      observation
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default addObservation;
