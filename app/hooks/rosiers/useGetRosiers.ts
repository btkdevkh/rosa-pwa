import { useEffect, useState } from "react";
import { Rosier } from "@/app/models/interfaces/Rosier";
import { Observation } from "@/app/models/interfaces/Observation";
import getRosiers from "@/app/services/rosiers/getRosiers";

const useGetRosiers = (plotID?: string | number | null) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [rosiers, setRosiers] = useState<Rosier[] | null>(null);
  const [observations, setObservations] = useState<Observation[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (plotID) {
      // Fetch rosiers from "server action"
      const fetchRosiers = async () => {
        try {
          const response = await getRosiers(+plotID);

          if (isMounted) {
            setLoading(false);

            if (response && response.status === 200) {
              const rosierData = response.data.rosiers;
              const observationData = response.data.observations;

              setRosiers(rosierData);
              setObservations(observationData);
            } else {
              setSuccess(false);
            }
          }
        } catch (error) {
          if (isMounted) {
            setLoading(false);
            setSuccess(false);
          }
          console.error("Failed to fetch rosiers:", error);
        }
      };

      fetchRosiers();
    }

    return () => {
      isMounted = false;
    };
  }, [plotID]);

  return { success, loading, rosiers, observations };
};

export default useGetRosiers;
