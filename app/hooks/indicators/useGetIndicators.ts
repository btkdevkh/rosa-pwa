import { useEffect, useState } from "react";
import { Indicateurs } from "@prisma/client";
import getIndicators from "@/app/actions/indicateurs/getIndicators";

const useGetIndicators = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [indicators, setIndicators] = useState<Indicateurs[] | null>(null);

  useEffect(() => {
    const fetchIndicators = async () => {
      const response = await getIndicators();
      setLoading(false);

      if (response && response.success && Array.isArray(response.indicators)) {
        const indicatorData = response.indicators;
        setIndicators(indicatorData);
      } else {
        setSuccess(false);
      }
    };

    fetchIndicators();
  }, []);

  return { success, loading, indicators };
};

export default useGetIndicators;
