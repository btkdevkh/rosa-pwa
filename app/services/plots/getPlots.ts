import axios from "axios";

const getPlots = async (id_exploitation?: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plots?exploitationID=${id_exploitation}`
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default getPlots;
