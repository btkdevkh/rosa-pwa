import dayjs from "dayjs";
import { Widget } from "../models/interfaces/Widget";
import { NivoLineSerie } from "../models/types/analyses/NivoLineSeries";

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

    // If there are fewer points than the number of ticks,
    // return all the dates
    if (totalPoints <= numberOfTicksX) {
      return uniqueDates.map(d => dayjs(d).toDate());
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

export default calculTickValues;
