import { useEffect, useState } from "react";
import getWidgets from "@/app/actions/widgets/getWidgets";
import { ObservationWidget } from "@/app/models/types/analyses/ObservationWidget";

const useGetWidgets = (explID?: number, dashboardID?: number) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [widgets, setWidgets] = useState<ObservationWidget[] | null>(null);

  useEffect(() => {
    if (explID && dashboardID) {
      // Fetch widgets from "server action"
      const fetWidgets = async () => {
        const widgets = await getWidgets(explID, dashboardID);
        setLoading(false);

        if (widgets && !Array.isArray(widgets) && !widgets.success) {
          setSuccess(false);
        } else {
          const sortedWidgets = (widgets as ObservationWidget[]).sort(
            (a, b) => a.widget.params.index - b.widget.params.index
          );

          setWidgets(sortedWidgets);
        }
      };

      fetWidgets();
    }
  }, [explID, dashboardID]);

  return { success, loading, widgets };
};

export default useGetWidgets;
