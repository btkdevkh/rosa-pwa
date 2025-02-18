"use client";

import Link from "next/link";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { ResponsiveLine } from "@nivo/line";
import { Widget } from "@/app/models/interfaces/Widget";
import { NivoLineSerie } from "@/app/models/types/analyses/NivoLineSeries";
import SettingSmallGearIcon from "@/app/components/shared/icons/SettingSmallGearIcon";
import CustomSliceToolTip from "@/app/components/shared/analyses/CustomSliceToolTip";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";

dayjs.extend(minMax);
dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

type MultiIndicatorsTemporalSerieProps = {
  widgetData: {
    widget: Widget;
    series: NivoLineSerie[];
  };
};
const MultiIndicatorsTemporalSerie = ({
  widgetData,
}: MultiIndicatorsTemporalSerieProps) => {
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();

  const tickValues = calculTickValues(widgetData);

  const empty = widgetData.series.find(
    serie => serie.data.length === 0 && serie.id_widget === widgetData.widget.id
  );

  const href = `${MenuUrlPath.ANALYSES}/widgets/updateWidget?explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}&widgetID=${widgetData.widget.id}`;

  // console.log("widgetData", widgetData);

  return (
    <div className={`h-[25rem] w-[${empty ? "100%" : "80%"}] bg-white p-3`}>
      <div className="flex gap-5 items-center">
        <Link href={href} prefetch={true}>
          <SettingSmallGearIcon />
        </Link>
        <h2 className="font-bold">{widgetData.widget.params.nom}</h2>
      </div>

      <div className={`h-[100%] flex gap-8 overflow-x-auto`}>
        {/* ResponsiveLine */}
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
            // tickValues: `every ${tickValues.length} day`,
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
          pointBorderWidth={2}
          pointLabel="data.yFormatted"
          pointLabelYOffset={-12}
          useMesh={true}
          enableSlices="x"
          enableTouchCrosshair={true}
          sliceTooltip={({ slice }) => <CustomSliceToolTip slice={slice} />}
        />

        {/* Legend */}
        <CustomLegend widgetData={widgetData} />
      </div>
    </div>
  );
};

export default MultiIndicatorsTemporalSerie;

type CustomLegendProps = {
  widgetData: {
    widget: Widget;
    series: NivoLineSerie[];
  };
};

const CustomLegend = ({ widgetData }: CustomLegendProps) => {
  const empty = widgetData.series.find(
    serie => serie.data.length === 0 && serie.id_widget === widgetData.widget.id
  );

  if (empty) return null;

  return (
    <div className="w-[20%] flex flex-col gap-2 justify-end mb-12">
      {widgetData.series.map(serie => (
        <div key={serie.id} className="w-[10rem] flex gap-2 items-center">
          <div
            className={`h-4 w-4`}
            style={{ backgroundColor: serie.color }}
          ></div>
          <span>{serie.id}</span>
        </div>
      ))}
    </div>
  );
};

// Helpers
const calculTickValues = (
  widgetData: {
    widget: Widget;
    series: NivoLineSerie[];
  },
  x: number = 10
) => {
  const numberOfTicksX = x; // 10 by default

  const dates = widgetData.series?.flatMap(
    s => s.data.map(d => dayjs(d.x).startOf("day").toISOString()) // Arrondir à jour
  );

  // Filtrage des doublons
  const uniqueDates = [...new Set(dates)];

  if (uniqueDates && uniqueDates.length > 0) {
    const totalPoints = uniqueDates.length;

    if (totalPoints <= numberOfTicksX) {
      // Convert ro local zone
      return uniqueDates.map(d => dayjs(d).toDate());
    } else {
      const interval = Math.floor(totalPoints / (numberOfTicksX - 1));
      const selectedDates: string[] = [];

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
