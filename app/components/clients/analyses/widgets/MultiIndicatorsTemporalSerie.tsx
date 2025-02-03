import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { ResponsiveLine } from "@nivo/line";
import { WidgetParams } from "@/app/models/interfaces/Widget";

dayjs.extend(minMax);

const MultiIndicatorsTemporalSerie = ({
  params,
  idWidget,
}: {
  params: WidgetParams;
  idWidget: number | undefined;
}) => {
  console.log("params :", params);
  console.log("idWidget :", idWidget);

  return (
    <ResponsiveLine
      data={data.length > 0 ? data : []}
      colors={d => d.color}
      margin={{ top: 30, right: 25, bottom: 60, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: 100,
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -50,
        legend: "",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        legend: "Fréquence et intensité (%)",
        legendPosition: "middle",
        tickValues: [0, 20, 40, 60, 80, 100],
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      useMesh={true}
      enableSlices={"x"}
    />
  );
};

export default MultiIndicatorsTemporalSerie;

const data = [
  {
    id: "Frequence rouille",
    color: "#70d670",
    data: [
      {
        x: "01/01",
        y: 34,
      },
      {
        x: "02/01",
        y: 37,
      },
      {
        x: "03/01",
        y: 40,
      },
      {
        x: "04/01",
        y: 43,
      },
      {
        x: "05/01",
        y: 45,
      },
      {
        x: "06/01",
        y: 47,
      },
      {
        x: "07/01",
        y: 49,
      },
      {
        x: "08/01",
        y: 50,
      },
      {
        x: "09/01",
        y: 51,
      },
      {
        x: "10/01",
        y: 52,
      },
      {
        x: "11/01",
        y: 53,
      },
      {
        x: "12/01",
        y: 55,
      },
      {
        x: "13/01",
        y: 56,
      },
      {
        x: "14/01",
        y: 57,
      },
    ],
  },
];
