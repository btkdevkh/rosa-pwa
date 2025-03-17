import { useEffect, useState } from "react";
import getWidgetsFilteredByPlot from "@/app/actions/widgets/getWidgetsFilteredByPlot";
import { ObservationWidget } from "@/app/models/types/analyses/ObservationWidget";

const useGetWidgets = (
  explID?: string | number | null,
  dashboardID?: string | number | null
) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [widgets, setWidgets] = useState<ObservationWidget[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (explID && dashboardID) {
      // Fetch widgets from "server action"
      const fetchWidgets = async () => {
        try {
          const response = await getWidgetsFilteredByPlot(
            +explID,
            +dashboardID
          );

          if (isMounted) {
            setLoading(false);

            if (
              (response && !response.success) ||
              (response && !response.widgets)
            ) {
              throw new Error("Failed to fetch widgets");
            }

            const sortedWidgets = (
              response.widgets as ObservationWidget[]
            ).sort((a, b) => a.widget.params.index - b.widget.params.index);
            setWidgets(sortedWidgets);
          }
        } catch (error) {
          console.error("Error :", error);
          if (isMounted) {
            setLoading(false);
            setSuccess(false);
          }
        }
      };

      fetchWidgets();
    }

    return () => {
      isMounted = false;
    };
  }, [explID, dashboardID]);

  return { success, loading, widgets };
};

export default useGetWidgets;
