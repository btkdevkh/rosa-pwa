import axios from "axios";

const getPlots = async (exploitationID?: number, onlyPlots?: boolean) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plots?exploitationID=${exploitationID}&onlyPlots=${onlyPlots}`
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default getPlots;
