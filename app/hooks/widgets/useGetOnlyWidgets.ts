import { useEffect, useState } from "react";
import { Widget } from "@/app/models/interfaces/Widget";
import getOnlyWidgets from "@/app/actions/widgets/getOnlyWidgets";

const useGetOnlyWidgets = (dashboardID?: string | number | null) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [onlyWidgets, setOnlyWidgets] = useState<Widget[] | null>(null);

  useEffect(() => {
    if (dashboardID) {
      // Fetch only widgets from "server action"
      const fetOnlyWidgets = async () => {
        const response = await getOnlyWidgets(+dashboardID);
        setLoading(false);

        if (response && !response.success) {
          setSuccess(false);
        } else {
          const sortedWidgets = (response.widgets as Widget[]).sort(
            (a, b) => a.params.index - b.params.index
          );

          setOnlyWidgets(sortedWidgets);
        }
      };

      fetOnlyWidgets();
    }
  }, [dashboardID]);

  return { success, loading, onlyWidgets };
};

export default useGetOnlyWidgets;
