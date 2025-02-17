import { useEffect, useState } from "react";
import { Indicateurs } from "@prisma/client";
import getIndicators from "@/app/actions/indicateurs/getIndicators";

const useGetIndicators = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [indicators, setIndicators] = useState<Indicateurs[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch indicators from "server action"
    const fetchIndicators = async () => {
      try {
        const response = await getIndicators();

        if (isMounted) {
          setLoading(false);

          if (
            response &&
            response.success &&
            Array.isArray(response.indicators)
          ) {
            const indicatorData = response.indicators;
            setIndicators(indicatorData);
          } else {
            setSuccess(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
          setSuccess(false);
        }
        console.error("Failed to fetch indicators:", error);
      }
    };

    fetchIndicators();

    return () => {
      isMounted = false;
    };
  }, []);

  return { success, loading, indicators };
};

export default useGetIndicators;
