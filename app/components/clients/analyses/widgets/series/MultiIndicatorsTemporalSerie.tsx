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
import { useEffect, useState } from "react";

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

  const [axisLeftTicks, setAxisLeftTicks] = useState<number[]>([]);
  const [axisRightTicks, setAxisRightTicks] = useState<number[]>([]);

  // Get the screen mode
  const screenMode = getPWADisplayMode();
  // Get the screen size
  const screenSize = window.matchMedia("(max-width: 1068px)").matches
    ? "mobile"
    : "desktop";

  // Get indicattor that have data empty
  const emptySeriesData = widgetData.series.filter(
    serie => serie.data.length === 0 && serie.id_widget === widgetData.widget.id
  );

  // Get the tick values for the x-axis
  const tickValues = calculTickValues(widgetData);

  const href = `${MenuUrlPath.ANALYSES}/widgets/updateWidget?explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}&widgetID=${widgetData.widget.id}`;

  // Axis left ticks
  useEffect(() => {
    if (
      widgetData.widget.params.indicateurs &&
      widgetData.widget.params.indicateurs.length > 0 &&
      widgetData.widget.params.axes &&
      widgetData.widget.params.axes.length > 0
    ) {
      // Get the min_max values on left axis
      const axeValuesLeft = widgetData.widget.params.indicateurs
        .filter(f => widgetData.widget.params.axes?.[0]?.id_indicator === f.id)
        .flatMap(fm => fm.min_max);

      if (axeValuesLeft.length > 0) {
        const yMinLeft = Math.min(...(axeValuesLeft as number[]));
        const yMaxLeft = Math.max(...(axeValuesLeft as number[]));

        // Get the min_max values on left axis
        const axisLeftTicks = generateYAxisTicks(yMinLeft, yMaxLeft, 4);
        setAxisLeftTicks(axisLeftTicks);
      }
    }
  }, [widgetData]);

  // Axis right ticks
  useEffect(() => {
    if (
      widgetData.widget.params.indicateurs &&
      widgetData.widget.params.indicateurs.length > 0 &&
      widgetData.widget.params.axes &&
      widgetData.widget.params.axes.length > 1
    ) {
      // Get the min_max values on right axis
      const axeValuesRight = widgetData.widget.params.indicateurs
        .filter(f => widgetData.widget.params.axes?.[1]?.id_indicator === f.id)
        .flatMap(fm => fm.min_max);

      if (axeValuesRight.length > 0) {
        const yMinRight = Math.min(...(axeValuesRight as number[]));
        const yMaxRight = Math.max(...(axeValuesRight as number[]));
        const axisRightTicks = generateYAxisTicks(yMinRight, yMaxRight, 4);
        setAxisRightTicks(axisRightTicks);
      }
    }
  }, [widgetData]);

  console.log("widgetData :", widgetData);
  console.log("axisLeftTicks :", axisLeftTicks);
  console.log("axisRightTicks :", axisRightTicks);

  return (
    <div
      className={`h-[30rem] w-[${
        emptySeriesData ? "100%" : "80%"
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
            tickValues: tickValues,
          }}
          // Left axis
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legend:
              widgetData.widget.params.axes &&
              widgetData.widget.params.axes.length > 0 &&
              widgetData.widget.params.axes[0].nom_axe,
            legendPosition: "middle",
            tickValues: Array.from(new Set([0, ...axisLeftTicks])),
          }}
          // Right axis
          axisRight={
            widgetData.widget.params.axes &&
            widgetData.widget.params.axes.length > 1
              ? {
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legendOffset: 40,
                  legend: widgetData.widget.params.axes[1].nom_axe,
                  legendPosition: "middle",
                  tickValues: axisRightTicks,
                }
              : null
          }
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
      // If there are fewer points than the number of ticks, return all the dates
      return uniqueDates.map(d => dayjs(d).toDate());

      // If fewer points than ticks, return spaced-out ticks
      // const step = Math.ceil(totalPoints / 5); // Space out every ~2 days if < 10 points
      // return uniqueDates
      //   .filter((_, index) => index % step === 0)
      //   .map(d => dayjs(d).toDate());
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
