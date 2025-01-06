import axios from "axios";

const getObservations = async (rosierID?: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers/observations?rosierID=${rosierID}`
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default getObservations;
