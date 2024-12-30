import axios from "axios";

const getRosiers = async (id_plot?: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers?plotID=${id_plot}`
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default getRosiers;
