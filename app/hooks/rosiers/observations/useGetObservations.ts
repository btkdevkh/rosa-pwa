import { useEffect, useState } from "react";
import { Observation } from "@/app/models/interfaces/Observation";
import getObservations from "@/app/services/rosiers/observations/getObservations";

const useGetObservations = (rosierID?: string | number | null) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [observations, setObservations] = useState<Observation[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (rosierID) {
      // Fetch observations from "server action"
      const fetchObservations = async () => {
        try {
          const response = await getObservations(rosierID);

          if (isMounted) {
            setLoading(false);

            if (response && response.status === 200) {
              const observationData = response.data.observations;
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
          console.error("Failed to fetch observations:", error);
        }
      };

      fetchObservations();
    }

    return () => {
      isMounted = false;
    };
  }, [rosierID]);

  return { success, loading, observations };
};

export default useGetObservations;
