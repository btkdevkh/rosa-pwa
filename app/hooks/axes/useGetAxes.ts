import { useEffect, useState } from "react";
import getAxes from "@/app/actions/axes/getAxes";
import { Axe } from "@/app/models/interfaces/Axe";

const useGetAxes = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [axes, setAxes] = useState<Axe[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch indicators from "server action"
    const fetchAxes = async () => {
      try {
        const response = await getAxes();

        if (isMounted) {
          setLoading(false);

          if (response && response.success && Array.isArray(response.axes)) {
            const axeData = response.axes;
            setAxes(axeData);
          } else {
            setSuccess(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
          setSuccess(false);
        }
        console.error("Failed to fetch axes :", error);
      }
    };

    fetchAxes();

    return () => {
      isMounted = false;
    };
  }, []);

  return { success, loading, axes };
};

export default useGetAxes;
