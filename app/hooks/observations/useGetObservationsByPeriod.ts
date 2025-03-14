import { useEffect, useRef, useState } from "react";
import getObservationsByPeriod from "@/app/actions/observations/getObservationsByPeriod";

const useGetObservationsByPeriod = (
  explID?: string | number | null,
  dashboardID?: string | number | null,
  dateRange?: [Date | null, Date | null] | null | undefined,
  dateModeAuto?: string | null,
  checkedDateModeAuto?: boolean,
  plotID?: number | null,
  widgetID?: number | null
) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [fromToAxe, setFromToAxe] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [nombreDeFeuillesAxe, setNombreDeFeuillesAxe] = useState<{
    min: number;
    max: number;
  } | null>(null);
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
            plotID,
            widgetID
          );

          if (isMounted) {
            setLoading(false);

            if (response && !response.success) {
              throw new Error("Failed to fetch observations");
            }

            if (response && response.fromToAxe != null) {
              setFromToAxe({
                min: response.fromToAxe.min,
                max: response.fromToAxe.max,
              });
            }

            if (response && response.nombreDeFeuillesAxe != null) {
              setNombreDeFeuillesAxe({
                min: response.nombreDeFeuillesAxe.min,
                max: response.nombreDeFeuillesAxe.max,
              });
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
  }, [
    explID,
    dashboardID,
    dateModeAuto,
    checkedDateModeAuto,
    plotID,
    widgetID,
  ]);

  return { success, loading, fromToAxe, nombreDeFeuillesAxe };
};

export default useGetObservationsByPeriod;
