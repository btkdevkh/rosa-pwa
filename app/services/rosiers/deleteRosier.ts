import axios from "axios";

const deleteRosier = async (rosierID: number) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rosiers?rosierID=${rosierID}`
    );

    return response;
  } catch (error) {
    console.log("Error:", error);
  }
};

export default deleteRosier;
