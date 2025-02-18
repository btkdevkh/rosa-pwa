import { useEffect, useState } from "react";
import getPlots from "@/app/services/plots/getPlots";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { Rosier } from "@/app/models/interfaces/Rosier";
import { Observation } from "@/app/models/interfaces/Observation";

const useGetPlots = (explID?: string | number | null, onlyPlots?: boolean) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [plots, setPlots] = useState<Parcelle[] | null>(null);
  const [rosiers, setRosiers] = useState<Rosier[] | null>(null);
  const [observations, setObservations] = useState<Observation[] | null>(null);

  // Fetch plots
  useEffect(() => {
    let isMounted = true;

    if (explID) {
      if (onlyPlots && onlyPlots == true) {
        const fetchOnlyPlots = async () => {
          try {
            const response = await getPlots(+explID, onlyPlots);

            if (isMounted) {
              setLoading(false);

              if (!response || (response && response.status !== 200)) {
                throw new Error("Failed to fetch only plots");
              }

              setPlots(response.data.plots);
            }
          } catch (error) {
            if (isMounted) {
              setLoading(false);
              setSuccess(false);
            }
            console.error("Error :", error);
          }
        };

        fetchOnlyPlots();
      } else {
        const fetchPlots = async () => {
          try {
            const response = await getPlots(+explID);

            if (isMounted) {
              setLoading(false);

              if (!response || (response && response.status !== 200)) {
                throw new Error("Failed to fetch plots");
              }

              setPlots(response.data.plots);
              setRosiers(response.data.rosiers);
              setObservations(response.data.observations);
            }
          } catch (error) {
            if (isMounted) {
              setLoading(false);
              setSuccess(false);
            }
            console.error("Error :", error);
          }
        };

        fetchPlots();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [explID, onlyPlots]);

  return { success, loading, plots, rosiers, observations, setRosiers };
};

export default useGetPlots;
