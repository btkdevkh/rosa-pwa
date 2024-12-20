import { useEffect, useState } from "react";
import getPlots from "@/app/services/plots/getPlots";
import { Parcelle } from "@/app/models/interfaces/Parcelle";

const usePlots = (id_exploitation?: number) => {
  const [plots, setPlots] = useState<Parcelle[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch plots
  useEffect(() => {
    getPlots(id_exploitation)
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
  }, [id_exploitation]);

  return { loading, plots };
};

export default usePlots;
