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
import standardDeviationRound from "@/app/helpers/standardDeviationRound";
import generateYAxisTicks from "@/app/helpers/generateYAxisTicks";
import calculTickValues from "@/app/helpers/calculTickValues";

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
      widgetData &&
      widgetData.series &&
      widgetData.series.length > 0 &&
      widgetData.widget.params.axes &&
      widgetData.widget.params.axes.length > 0
    ) {
      // Get values from series
      const axeValuesLeft = widgetData.series
        .filter(s => {
          const diseaseName =
            s.id === "Fréquence rouille" ||
            s.id === "Intensité rouille" ||
            s.id === "Fréquence écidies" ||
            s.id === "Fréquence urédos" ||
            s.id === "Fréquence téleutos" ||
            s.id === "Fréquence marsonia"
              ? "Fréquence et intensité (%)"
              : s.id;

          return widgetData.widget.params.axes?.[0]?.nom_axe === diseaseName;
        })
        .filter(fm => fm != null)
        .filter(fm => fm != undefined)
        .flatMap(fm => fm.data.map(m => m.y))
        .map(m => standardDeviationRound(m as number));

      if (
        widgetData.widget.params.axes?.[0]?.automatic &&
        axeValuesLeft &&
        axeValuesLeft.length > 0
      ) {
        setAxisLeftTicks(axeValuesLeft as number[]);
      } else {
        const axeValuesLeftFromIndicator =
          widgetData.widget.params.indicateurs?.find(
            indicateur =>
              indicateur.id === widgetData.widget.params.axes?.[0]?.id_indicator
          )?.min_max;

        if (
          axeValuesLeftFromIndicator &&
          axeValuesLeftFromIndicator.length > 0
        ) {
          const axisValuesManual = generateYAxisTicks(
            Math.min(...axeValuesLeftFromIndicator),
            Math.max(...axeValuesLeftFromIndicator),
            6
          );
          setAxisLeftTicks(axisValuesManual);
        } else {
          setAxisLeftTicks([0, 20, 40, 60, 80, 100]);
        }
      }
    }
  }, [widgetData]);

  // Axis right ticks
  useEffect(() => {
    if (
      widgetData &&
      widgetData.series &&
      widgetData.series.length > 0 &&
      widgetData.widget.params.axes &&
      widgetData.widget.params.axes.length > 1
    ) {
      // Get values from series
      const axeValuesRight = widgetData.series
        .filter(s => {
          const diseaseName =
            s.id === "Fréquence rouille" ||
            s.id === "Intensité rouille" ||
            s.id === "Fréquence écidies" ||
            s.id === "Fréquence urédos" ||
            s.id === "Fréquence téleutos" ||
            s.id === "Fréquence marsonia"
              ? "Fréquence et intensité (%)"
              : s.id;

          return widgetData.widget.params.axes?.[1]?.nom_axe === diseaseName;
        })
        .filter(fm => fm != null)
        .filter(fm => fm != undefined)
        .flatMap(fm => fm.data.map(m => m.y))
        .map(y => standardDeviationRound(y as number));

      if (
        widgetData.widget.params.axes?.[1]?.automatic &&
        axeValuesRight &&
        axeValuesRight.length > 0
      ) {
        setAxisRightTicks(axeValuesRight as number[]);
      } else {
        const axeValuesLeftFromIndicator =
          widgetData.widget.params.indicateurs?.find(
            indicateur =>
              indicateur.id === widgetData.widget.params.axes?.[1].id_indicator
          )?.min_max;

        if (
          axeValuesLeftFromIndicator &&
          axeValuesLeftFromIndicator.length > 0
        ) {
          const axisValuesManual = generateYAxisTicks(
            Math.min(...axeValuesLeftFromIndicator),
            Math.max(...axeValuesLeftFromIndicator),
            6
          );
          setAxisRightTicks(axisValuesManual);
        } else {
          setAxisRightTicks([0, 20, 40, 60, 80, 100]);
        }
      }
    }
  }, [widgetData]);

  // Check if the widget had only one axe
  const widgetHadOnlyOneAxe = widgetData.widget.params.axes?.length === 1;

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
          margin={{ top: 20, right: 50, bottom: 60, left: 50 }}
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
            min: widgetHadOnlyOneAxe
              ? Math.min(...axisLeftTicks)
              : Math.min(...axisRightTicks, ...axisLeftTicks),
            max: widgetHadOnlyOneAxe
              ? Math.max(...axisLeftTicks)
              : Math.max(...axisRightTicks, ...axisLeftTicks),
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
            tickValues: Array.from(new Set([...axisLeftTicks])),
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
                  tickValues: Array.from(new Set([...axisRightTicks])),
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
