import { useEffect, useState } from "react";
import getPlots from "@/app/services/plots/getPlots";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { Observation } from "@/app/models/interfaces/Observation";
import { Rosier } from "@/app/models/interfaces/Rosier";

const useGetPlots = (explID?: number, onlyPlots?: boolean) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [plots, setPlots] = useState<Parcelle[] | null>(null);
  const [observations, setObservations] = useState<Observation[] | null>(null);
  const [rosiers, setRosiers] = useState<Rosier[] | null>(null);

  // Fetch plots
  useEffect(() => {
    let isMounted = true;

    if (explID) {
      if (onlyPlots && onlyPlots == true) {
        const fetchOnlyPlots = async () => {
          try {
            const response = await getPlots(explID, onlyPlots);

            if (isMounted) {
              setLoading(false);

              if (response && response.status === 200) {
                setPlots(response.data.plots);
              }
            }
          } catch (error) {
            if (isMounted) {
              setLoading(false);
              setSuccess(false);
            }
            console.error("Failed to fetch only plots:", error);
          }
        };

        fetchOnlyPlots();
      } else {
        const fetchPlots = async () => {
          try {
            const response = await getPlots(explID);

            if (isMounted) {
              setLoading(false);

              if (response && response.status === 200) {
                setPlots(response.data.plots);
                setRosiers(response.data.rosiers);
                setObservations(response.data.observations);
              }
            }
          } catch (error) {
            if (isMounted) {
              setLoading(false);
              setSuccess(false);
            }
            console.error("Failed to fetch plots:", error);
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
