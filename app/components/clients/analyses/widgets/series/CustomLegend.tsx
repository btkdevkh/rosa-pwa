import { useEffect, useState } from "react";
import { Parcelles } from "@prisma/client";
import getPlotByID from "@/app/actions/plots/getPlotByID";
import { Widget } from "@/app/models/interfaces/Widget";
import { NivoLineSerie } from "@/app/models/types/analyses/NivoLineSeries";

type CustomLegendProps = {
  widgetData: {
    widget: Widget;
    series: NivoLineSerie[];
  };
};

const CustomLegend = ({ widgetData }: CustomLegendProps) => {
  const [plot, setPlot] = useState<Parcelles | null>(null);

  useEffect(() => {
    if (!widgetData.widget.params.id_plot) {
      return setPlot(null);
    }

    const fetchPlotByID = async (plotID: number) => {
      try {
        const response = await getPlotByID(plotID);
        if (response) setPlot(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchPlotByID(widgetData.widget.params.id_plot);
  }, [widgetData]);

  return (
    <div className="w-[20%] flex flex-col gap-2 justify-end mb-12">
      {widgetData.series
        // .filter(s => s.data.length > 0)
        .map(serie => (
          <div key={serie.id} className="w-[15rem] flex gap-2 items-center">
            <div
              className={`h-4 w-4`}
              style={{ backgroundColor: serie.color }}
            ></div>
            <span>{serie.id}</span>
          </div>
        ))}

      {plot && (
        <div className="mt-2 flex gap-2 items-center">
          <span>{plot.nom}</span>
        </div>
      )}
    </div>
  );
};

export default CustomLegend;
