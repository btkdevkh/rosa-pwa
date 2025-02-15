import { getServerSession } from "next-auth";
import authOptions from "./api/auth/authOptions";
import { redirect } from "next/navigation";
import { MenuUrlPath } from "./models/enums/MenuUrlPathEnum";

// Url "/"
// This page is a server component,
// it render the client component.
const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(MenuUrlPath.ANALYSES);
  }

  return null;
};

export default HomePage;
