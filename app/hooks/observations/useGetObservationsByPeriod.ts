import { useEffect, useRef, useState } from "react";
import getObservationsByPeriod from "@/app/actions/observations/getObservationsByPeriod";

const useGetObservationsByPeriod = (
  explID?: string | number | null,
  dashboardID?: string | number | null,
  dateRange?: [Date | null, Date | null] | null | undefined,
  dateModeAuto?: string | null,
  checkedDateModeAuto?: boolean,
  plotID?: number | null
) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [minFreq, setMinFreq] = useState<string | number | null>(null);
  const [maxFreq, setMaxFreq] = useState<string | number | null>(null);
  const [minNum, setMinNum] = useState<string | number | null>(null);
  const [maxNum, setMaxNum] = useState<string | number | null>(null);
  const dataRangeRef = useRef(dateRange);

  useEffect(() => {
    let isMounted = true;

    if (explID && dashboardID) {
      // Fetch widgets from "server action"
      const fetchObservations = async () => {
        try {
          const response = await getObservationsByPeriod(
            +explID,
            +dashboardID,
            dataRangeRef.current,
            dateModeAuto,
            checkedDateModeAuto,
            plotID
          );

          if (isMounted) {
            setLoading(false);

            if (response && !response.success) {
              throw new Error("Failed to fetch observations");
            }

            if (response && response.freqInt != null) {
              setMinFreq(response.freqInt.min);
            }

            if (response && response.freqInt != null) {
              setMaxFreq(response.freqInt.max);
            }

            if (response && response.nbFeuille != null) {
              setMinNum(response.nbFeuille.min);
            }

            if (response && response.nbFeuille != null) {
              setMaxNum(response.nbFeuille.max);
            }
          }
        } catch (error) {
          console.error("Error :", error);
          if (isMounted) {
            setLoading(false);
            setSuccess(false);
          }
        }
      };

      fetchObservations();
    }

    return () => {
      isMounted = false;
    };
  }, [explID, dashboardID, dateModeAuto, checkedDateModeAuto, plotID]);

  return { success, loading, minFreq, maxFreq, minNum, maxNum };
};

export default useGetObservationsByPeriod;
