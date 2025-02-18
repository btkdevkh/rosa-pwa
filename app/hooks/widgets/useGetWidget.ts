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

            if (response && !response.success) {
              throw new Error("Failed to fetch widget");
            }

            setWidget(response.widget as Widget);
          }
        } catch (error) {
          console.error("Error :", error);
          if (isMounted) {
            setLoading(false);
            setSuccess(false);
          }
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
