import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/authOptions";
import { MenuUrlPath } from "../models/enums/MenuUrlPathEnum";
import LoginClient from "../components/clients/login/LoginClient";
import getUserExploitations from "../actions/exploitations/getUserExploitations";

// Url "/login"
// This page is a server component,
// it render the client component.
const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session && session.user && "id_user_postgres" in session.user) {
    const response = await getUserExploitations(
      session.user.id_user_postgres as unknown as number
    );

    if (
      response &&
      response.exploitations &&
      response.exploitations.length > 0
    ) {
      redirect(`${MenuUrlPath.HOME}`);
    }
  }

  return <LoginClient />;
};

export default LoginPage;
