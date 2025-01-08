import { getServerSession } from "next-auth";
import authOptions from "./authOptions";

// Auth required
const authRequired = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authorized");
  }
};

export default authRequired;
