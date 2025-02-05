"use client";

import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { ResponsiveLine } from "@nivo/line";
import { Widget } from "@/app/models/interfaces/Widget";
import { NivoLineSerie } from "@/app/models/types/analyses/NivoLineSeries";
import SettingSmallGearIcon from "@/app/components/shared/SettingSmallGearIcon";
import CustomSliceToolTip from "@/app/components/shared/analyses/CustomSliceToolTip";
import { useRouter } from "next/navigation";

dayjs.extend(minMax);

type MultiIndicatorsTemporalSerieProps = {
  widgetData: {
    widget: Widget;
    series: NivoLineSerie[];
  };
};
const MultiIndicatorsTemporalSerie = ({
  widgetData,
}: MultiIndicatorsTemporalSerieProps) => {
  const router = useRouter();

  const handleSettingWidget = (widget: Widget) => {
    console.log("widget :", widget);
    router.push(`/analyses/graphique/updateGraphique?widgetID=${widget.id}`);
  };

  // Ticks
  const tickValues = calculTickValues(widgetData);

  return (
    <div className="h-[25rem] bg-white p-3">
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
        <p className="text-sm">
          {widgetData.series.find(
            serie =>
              serie.data.length === 0 &&
              serie.id_widget === widgetData.widget.id
          )
            ? "n/a"
            : ""}
        </p>
      </div>

      {/* ResponsiveLine */}
      <div className="h-[100%] w-[100%] overflow-hidden">
        <ResponsiveLine
          data={
            widgetData.series.length > 0
              ? widgetData.series.filter(serie => serie.data.length > 0)
              : []
          }
          colors={d => d.color}
          margin={{ top: 15, right: 10, bottom: 60, left: 50 }}
          xFormat="time:%d/%m/%Y"
          xScale={{
            type: "time",
            format: "%d/%m/%Y",
            precision: "day",
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
            format: "%d/%m",
            tickValues: tickValues,
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
          pointSize={4}
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

// Helpers
// Calc ticks
const calculTickValues = (widgetData: {
  widget: Widget;
  series: NivoLineSerie[];
}) => {
  const dates = widgetData.series?.flatMap(
    s => s.data.map(d => dayjs(d.x).startOf("day").toISOString()) // Arrondir à jour
  );
  const numberOfTicksX = 10; // Par default

  // Filtrage des doublons
  const uniqueDates = [...new Set(dates)];

  if (uniqueDates && uniqueDates.length > 0) {
    const totalPoints = uniqueDates.length;

    if (totalPoints <= numberOfTicksX) {
      // Convert ro local zone
      return uniqueDates.map(d => dayjs(d).toDate());
    } else {
      const interval = Math.floor(totalPoints / (numberOfTicksX - 1));
      const selectedDates = [];

      for (let i = 0; i < numberOfTicksX; i++) {
        const index = i * interval;

        if (index < totalPoints) {
          selectedDates.push(uniqueDates[index]);
        } else {
          selectedDates.push(uniqueDates[totalPoints - 1]);
        }
      }

      // Convert ro local zone
      return selectedDates.map(d => dayjs(d).toDate());
    }
  }

  return [];
};
