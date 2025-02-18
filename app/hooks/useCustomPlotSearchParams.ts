import { useSearchParams } from "next/navigation";

const useCustomPlotSearchParams = () => {
  const searchParams = useSearchParams();

  const plotID = searchParams.get("plotID");
  const plotName = searchParams.get("plotName");
  const plotArchived = searchParams.get("archived");

  return { plotID, plotName, plotArchived };
};

export default useCustomPlotSearchParams;
