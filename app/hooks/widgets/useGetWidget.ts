import { useEffect, useState } from "react";
import { Widget } from "@/app/models/interfaces/Widget";
import getWidget from "@/app/actions/widgets/getWidget";

const useGetWidget = (widgetID?: string | number | null) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [widget, setWidget] = useState<Widget | null>(null);

  useEffect(() => {
    if (widgetID) {
      const fetWidget = async () => {
        const response = await getWidget(+widgetID);
        setLoading(false);

        if (response && response.widget && response.success) {
          setWidget(response.widget as Widget);
        } else {
          setSuccess(false);
        }
      };

      fetWidget();
    }
  }, [widgetID]);

  return { success, loading, widget };
};

export default useGetWidget;
