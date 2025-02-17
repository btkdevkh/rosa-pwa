import { useEffect, useState } from "react";
import getWidgets from "@/app/actions/widgets/getWidgets";
import { ObservationWidget } from "@/app/models/types/analyses/ObservationWidget";

const useGetWidgets = (explID?: number, dashboardID?: number) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [widgets, setWidgets] = useState<ObservationWidget[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (explID && dashboardID) {
      // Fetch widgets from "server action"
      const fetchWidgets = async () => {
        try {
          const widgets = await getWidgets(explID, dashboardID);

          if (isMounted) {
            setLoading(false);

            if (widgets && !Array.isArray(widgets) && !widgets.success) {
              setSuccess(false);
            } else {
              const sortedWidgets = (widgets as ObservationWidget[]).sort(
                (a, b) => a.widget.params.index - b.widget.params.index
              );

              setWidgets(sortedWidgets);
            }
          }
        } catch (error) {
          if (isMounted) {
            setLoading(false);
            setSuccess(false);
          }
          console.error("Failed to fetch widgets:", error);
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
