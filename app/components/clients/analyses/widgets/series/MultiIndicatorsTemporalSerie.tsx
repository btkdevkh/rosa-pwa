"use client";

import Link from "next/link";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { ResponsiveLine } from "@nivo/line";
import { Widget } from "@/app/models/interfaces/Widget";
import { NivoLineSerie } from "@/app/models/types/analyses/NivoLineSeries";
import SettingSmallGearIcon from "@/app/components/shared/icons/SettingSmallGearIcon";
import CustomSliceToolTip from "@/app/components/clients/analyses/widgets/series/CustomSliceToolTip";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import getPWADisplayMode from "@/app/helpers/getPWADisplayMode";
import CustomLegend from "./CustomLegend";

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

  console.log("widgetData :", widgetData);
  console.log("widget series :", widgetData.series);
  console.log("widget indicateurs :", widgetData.widget.params.indicateurs);

  // Get the screen mode
  const screenMode = getPWADisplayMode();
  // Get the screen size
  const screenSize = window.matchMedia("(max-width: 1068px)").matches
    ? "mobile"
    : "desktop";

  // Get the tick values for the x-axis
  const tickValues = calculTickValues(widgetData);

  // Get indicattor that have data empty
  const seriesEmpty = widgetData.series.filter(
    serie => serie.data.length === 0 && serie.id_widget === widgetData.widget.id
  );

  // Get the min and max values from all indicators
  const axeValuesLeft = widgetData.widget.params.indicateurs
    ?.filter(f => seriesEmpty.every(s => s.id_indicator !== f.id))
    .flatMap(indicateur => indicateur.min_max)
    .map(f => {
      // if value is greter tha 100, set that value to 100
      if (f > 100) f = 100;
      if (f === 3 || f === 2 || f === 1) f = 0;
      return f;
    });

  // Get the min and max values from axeValues
  const yMinLeft =
    axeValuesLeft && axeValuesLeft.length > 0
      ? Math.min(...axeValuesLeft.flat())
      : 0;
  const yMaxLeft =
    axeValuesLeft && axeValuesLeft.length > 0
      ? Math.max(...axeValuesLeft.flat())
      : 100;

  // Get the tick values for the y-axis
  const axisLeftTicks = generateYAxisTicks(yMinLeft, yMaxLeft, 4);
  const axisRightTicks = generateYAxisTicks(yMinLeft, yMaxLeft, 4);

  // Get the indicattor that have data empty
  const empty = widgetData.series.find(
    serie => serie.data.length === 0 && serie.id_widget === widgetData.widget.id
  );

  const href = `${MenuUrlPath.ANALYSES}/widgets/updateWidget?explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}&widgetID=${widgetData.widget.id}`;

  // console.log("seriesEmpty", seriesEmpty);
  // console.log("axeValues from all indicators :", axeValues);
  // console.log("axisLeftTicks calc :", axisLeftTicks);
  // console.log("tickValues :", tickValues);

  return (
    <div
      className={`h-[30rem] w-[${
        empty ? "100%" : "80%"
      }] bg-white p-3 rounded-md`}
    >
      <div className="flex gap-5 items-center">
        <Link href={href} prefetch={true}>
          <SettingSmallGearIcon />
        </Link>
        <h2 className="font-bold">{widgetData.widget.params.nom}</h2>
      </div>

      <div
        className={`h-[100%] flex gap-8 ${
          screenMode !== "browser" || screenSize !== "desktop"
            ? "overflow-x-auto"
            : ""
        }`}
      >
        {/* ResponsiveLine */}
        <ResponsiveLine
          data={
            widgetData.series.length > 0
              ? widgetData.series.filter(serie => serie.data.length > 0)
              : []
          }
          colors={d => d.color}
          margin={{ top: 15, right: 50, bottom: 60, left: 50 }}
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
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legendOffset: 50,
            format: "%d/%m",
            // tickValues: `every ${7} day`,
            tickValues: tickValues,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legend:
              widgetData.widget.params.axes &&
              widgetData.widget.params.axes.length > 0 &&
              widgetData.widget.params.axes[0],

            legendPosition: "middle",
            tickValues: Array.from(new Set([0, ...axisLeftTicks])),
            // tickValues: [0, 20, 40, 60, 80, 100],
          }}
          axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: 40,
            legend: "Axe 2",
            legendPosition: "middle",
            tickValues: axisRightTicks,
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

// Helpers
const calculTickValues = (
  widgetData: {
    widget: Widget;
    series: NivoLineSerie[];
  },
  x: number = 10
) => {
  const numberOfTicksX = x; // Default to 10

  const dates = widgetData.series?.flatMap(
    s => s.data.map(d => dayjs(d.x).startOf("day").toISOString()) // Round to day
  );

  // Remove duplicates
  const uniqueDates = [...new Set(dates)];

  if (uniqueDates.length > 0) {
    const totalPoints = uniqueDates.length;

    if (totalPoints <= numberOfTicksX) {
      // If fewer points than ticks, return spaced-out ticks
      const step = Math.ceil(totalPoints / 5); // Space out every ~2 days if < 10 points
      return uniqueDates
        .filter((_, index) => index % step === 0)
        .map(d => dayjs(d).toDate());
    } else {
      // Otherwise, select evenly spaced ticks
      const step = Math.ceil(totalPoints / numberOfTicksX);
      return uniqueDates
        .filter((_, index) => index % step === 0)
        .map(d => dayjs(d).toDate());
    }
  }

  return [];
};

const generateYAxisTicks = (
  min: number,
  max: number,
  tickCount: number = 5
): number[] => {
  const step = (max - min) / (tickCount - 1);
  return Array.from({ length: tickCount }, (_, i) =>
    Math.round(min + i * step)
  ).filter(f => f != null);
};
