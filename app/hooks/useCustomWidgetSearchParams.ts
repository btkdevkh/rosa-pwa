import { useSearchParams } from "next/navigation";

const useCustomWidgetSearchParams = () => {
  const searchParams = useSearchParams();

  const widgetID = searchParams.get("widgetID");

  return { widgetID };
};

export default useCustomWidgetSearchParams;
