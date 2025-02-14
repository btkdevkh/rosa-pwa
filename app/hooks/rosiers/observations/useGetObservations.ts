import { useEffect, useState } from "react";
import { Observation } from "@/app/models/interfaces/Observation";
import getObservations from "@/app/services/rosiers/observations/getObservations";

const useGetObservations = (rosierID?: string | number | null) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [observations, setObservations] = useState<Observation[] | null>(null);

  useEffect(() => {
    if (rosierID) {
      const fetchObservations = async () => {
        const response = await getObservations(rosierID);
        setLoading(false);

        if (response && response.status === 200) {
          const observationData = response.data.observations;
          setObservations(observationData);
        } else {
          setSuccess(false);
        }
      };

      fetchObservations();
    }
  }, [rosierID]);

  return { success, loading, observations };
};

export default useGetObservations;
