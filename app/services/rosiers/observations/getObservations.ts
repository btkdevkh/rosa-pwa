import axios, { RawAxiosRequestHeaders } from "axios";
import { headers } from "next/headers";

const getObservations = async (rosierID?: number) => {
  try {
    const resolvedHeaders = await headers();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers/observations?rosierID=${rosierID}`,
      { headers: resolvedHeaders as unknown as Partial<RawAxiosRequestHeaders> }
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default getObservations;
