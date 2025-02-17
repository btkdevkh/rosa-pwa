import { useEffect, useState } from "react";
import { Widget } from "@/app/models/interfaces/Widget";
import getWidget from "@/app/actions/widgets/getWidget";

const useGetWidget = (widgetID?: string | number | null) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [widget, setWidget] = useState<Widget | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (widgetID) {
      // Fetch widget from "server action"
      const fetWidget = async () => {
        try {
          const response = await getWidget(+widgetID);

          if (isMounted) {
            setLoading(false);

            if (response && response.widget && response.success) {
              setWidget(response.widget as Widget);
            } else {
              setSuccess(false);
            }
          }
        } catch (error) {
          if (isMounted) {
            setLoading(false);
            setSuccess(false);
          }
          console.error("Failed to fetch widget:", error);
        }
      };

      fetWidget();
    }

    return () => {
      isMounted = false;
    };
  }, [widgetID]);

  return { success, loading, widget };
};

export default useGetWidget;
