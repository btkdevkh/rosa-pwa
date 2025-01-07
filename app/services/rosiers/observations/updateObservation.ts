import axios from "axios";
import { Observation } from "@/app/models/interfaces/Observation";

const updateObservation = async (
  observation: Observation,
  observationID: number
) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers/observations?observationID=${observationID}`,
      observation
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default updateObservation;
