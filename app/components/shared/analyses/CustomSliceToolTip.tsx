import { DatumValue, Point } from "@nivo/line";

type SliceToolTip = {
  slice: {
    id: DatumValue;
    height: number;
    width: number;
    x0: number;
    x: number;
    y0: number;
    y: number;
    points: readonly Point[];
  };
};

const CustomSliceToolTip = ({ slice }: SliceToolTip) => {
  const { points } = slice;

  return points.map(point => {
    const color = point.serieColor;
    const date = new Date(point.data.x).toLocaleDateString();

    return (
      <div className={`bg-white p-3 border border-txton2 mb-3`} key={point.id}>
        <div className="flex flex-col gap-3">
          <p>{date}</p>
          <div className="flex gap-2 items-center">
            <div className={`h-4 w-4`} style={{ backgroundColor: color }}></div>
            <span>{point.serieId} :</span>

            {point.data.y && Number(point.data.y) >= 0 && (
              <span>{point.data.y.toString()}</span>
            )}
          </div>
        </div>
      </div>
    );
  });
};

export default CustomSliceToolTip;
