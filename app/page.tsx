import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/authOptions";
import { MenuUrlPath } from "./models/enums/MenuUrlPathEnum";
import getUserExploitations from "./actions/exploitations/getUserExploitations";

// Url "/"
// This page is a server component,
// it render the client component.
const HomePage = async () => {
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
      const { exploitations } = response;

      const explID = exploitations[0]?.id;
      const explName = exploitations[0]?.nom;
      const dashboardID = exploitations[0]?.Dashboards[0]?.id ?? null;
      const hadDashboard =
        exploitations[0]?.Dashboards && exploitations[0].Dashboards.length > 0
          ? true
          : false;

      redirect(
        `${MenuUrlPath.ANALYSES}?explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`
      );
    }
  } else {
    redirect(MenuUrlPath.LOGIN);
  }
};

export default HomePage;
