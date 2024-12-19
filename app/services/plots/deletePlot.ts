import axios from "axios";

const deletePlot = async (plotID: number) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plots?plotID=${plotID}`
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default deletePlot;
