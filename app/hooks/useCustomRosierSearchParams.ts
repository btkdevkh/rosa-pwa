import { useSearchParams } from "next/navigation";

const useCustomRosierSearchParams = () => {
  const searchParams = useSearchParams();

  const rosierID = searchParams.get("rosierID");
  const rosierName = searchParams.get("rosierName");

  return { rosierID, rosierName };
};

export default useCustomRosierSearchParams;
