import axios from "axios";

const getRosiers = async (plotID?: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers?plotID=${plotID}`
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default getRosiers;
