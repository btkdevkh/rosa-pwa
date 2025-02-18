import { useSearchParams } from "next/navigation";

const useCustomExplSearchParams = () => {
  const searchParams = useSearchParams();

  const explID = searchParams.get("explID");
  const explName = searchParams.get("explName");
  const dashboardID = searchParams.get("dashboardID");
  const hadDashboard = searchParams.get("hadDashboard");

  return { explID, explName, dashboardID, hadDashboard };
};

export default useCustomExplSearchParams;
