import { useEffect, useState } from "react";
import getPlots from "@/app/services/plots/getPlots";
import { Parcelle } from "@/app/models/interfaces/Parcelle";
import { Observation } from "@/app/models/interfaces/Observation";
import { Rosier } from "@/app/models/interfaces/Rosier";

const usePlots = (exploitationID?: number, onlyPlots?: boolean) => {
  const [plots, setPlots] = useState<Parcelle[] | null>(null);
  const [observations, setObservations] = useState<Observation[] | null>(null);
  const [rosiers, setRosiers] = useState<Rosier[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch plots
  useEffect(() => {
    if (exploitationID) {
      if (onlyPlots && onlyPlots == true) {
        getPlots(exploitationID, onlyPlots)
          .then(response => {
            if (response && response.status === 200) {
              setPlots(response.data.plots);
            }
          })
          .catch(error => {
            console.log("Error :", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        getPlots(exploitationID)
          .then(response => {
            if (response && response.status === 200) {
              setPlots(response.data.plots);
              setRosiers(response.data.rosiers);
              setObservations(response.data.observations);
            }
          })
          .catch(error => {
            console.log("Error :", error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [exploitationID, onlyPlots]);

  return { loading, plots, rosiers, observations, setRosiers };
};

export default usePlots;
