import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { ResponsiveLine } from "@nivo/line";
import Big from "big.js";
import { Widget } from "@/app/models/interfaces/Widget";
import SettingSmallGearIcon from "@/app/components/shared/SettingSmallGearIcon";
import CustomSliceToolTip from "@/app/components/shared/analyses/CustomSliceToolTip";
import { NivoLineSeries } from "@/app/models/types/analyses/NivoLineSeries";

dayjs.extend(minMax);

type MultiIndicatorsTemporalSerieProps = {
  widgetData: {
    widget: Widget;
    series: NivoLineSeries[];
  };
};
const MultiIndicatorsTemporalSerie = ({
  widgetData,
}: MultiIndicatorsTemporalSerieProps) => {
  // console.log("widgetData :", widgetData);

  const handleSettingWidget = (widget: Widget) => {
    console.log("widget :", widget);
  };

  const calculTickValues = () => {
    const dates = widgetData.series?.flatMap(s =>
      s.data.flatMap(d => dayjs(d.x))
    );
    if (dates) {
      const dateMax = dayjs.max(dates);
      const dateMin = dayjs.min(dates);
      if (dateMax && dateMin) {
        const value = new Big(dateMax?.diff(dateMin, "day") / 22)
          .round(0)
          .toNumber();
        return value !== 0 ? value : 1;
      }
    }
  };

  return (
    <div className="h-[20rem] bg-white p-3">
      <div className="flex gap-7 items-center">
        <button
          onClick={e => {
            e.preventDefault();
            handleSettingWidget(widgetData.widget);
          }}
        >
          <SettingSmallGearIcon />
        </button>
        <h2 className="font-bold">{widgetData.widget.params.nom}</h2>
      </div>

      {/* ResponsiveLine */}
      <div className="h-[100%] w-[100%] overflow-hidden">
        <ResponsiveLine
          data={widgetData.series.length > 0 ? widgetData.series : []}
          colors={d => d.color}
          margin={{ top: 15, right: 10, bottom: 60, left: 50 }}
          xFormat="time:%d/%m/%Y"
          xScale={{
            format: "%d/%m/%Y",
            precision: "day",
            type: "time",
            useUTC: false,
          }}
          yScale={{
            type: "linear",
            stacked: false,
            reverse: false,
            min: 0,
            max: 100,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legendOffset: 50,
            legendPosition: "start",
            format: "%m/%d",
            tickValues: `every ${calculTickValues()} day`,
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
          pointSize={6}
          // pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointLabel="data.yFormatted"
          pointLabelYOffset={-12}
          useMesh={true}
          enableSlices="x"
          enableTouchCrosshair={true}
          sliceTooltip={({ slice }) => <CustomSliceToolTip slice={slice} />}
        />
      </div>
    </div>
  );
};

export default MultiIndicatorsTemporalSerie;
