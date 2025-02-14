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
    if (plotID) {
      const fetchRosiers = async () => {
        const response = await getRosiers(+plotID);
        setLoading(false);

        if (response && response.status === 200) {
          const rosierData = response.data.rosiers;
          const observationData = response.data.observations;

          setRosiers(rosierData);
          setObservations(observationData);
        } else {
          setSuccess(false);
        }
      };

      fetchRosiers();
    }
  }, [plotID]);

  return { success, loading, rosiers, observations };
};

export default useGetRosiers;
