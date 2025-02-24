import { Axe } from "@/app/models/interfaces/Axe";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import useGetObservationsByPeriod from "@/app/hooks/observations/useGetObservationsByPeriod";

type AxeWidgetAutomaticNumberProps = {
  index: number;
  axeNumberIndicator: Indicateur;
  dateRange?: [Date | null, Date | null] | null | undefined;
  dateModeAuto?: string | null | undefined;
  checkedDateModeAuto?: boolean;
  setAxes: Dispatch<SetStateAction<Axe[]>>;
};

const AxeWidgetAutomaticNumber = ({
  index,
  axeNumberIndicator,
  dateRange,
  dateModeAuto,
  checkedDateModeAuto,
  setAxes,
}: AxeWidgetAutomaticNumberProps) => {
  const { explID, dashboardID } = useCustomExplSearchParams();
  const { minNum, maxNum } = useGetObservationsByPeriod(
    explID,
    dashboardID,
    dateRange,
    dateModeAuto,
    checkedDateModeAuto
  );
  const [checkedAxeAutomatic, setCheckedAxeAutomatic] = useState(true);
  const [checkedAxeNumber, setCheckedAxeNumber] = useState(false);
  const [axeNumFrom, setAxeNumFrom] = useState<number | string>(0);
  const [axeNumTo, setAxeNumTo] = useState<number | string>(100);

  useEffect(() => {
    setAxes(prevs => {
      return [
        ...prevs.filter(prev => prev.id_indicator !== axeNumberIndicator?.id),
        {
          nom: axeNumberIndicator.nom,
          min: checkedAxeAutomatic ? minNum : +axeNumFrom,
          max: checkedAxeAutomatic ? maxNum : +axeNumTo,
          id_indicator: axeNumberIndicator.id,
        },
      ] as Axe[];
    });
  }, [
    minNum,
    maxNum,
    setAxes,
    checkedAxeAutomatic,
    axeNumFrom,
    axeNumTo,
    axeNumberIndicator,
  ]);

  return (
    <div className="flex flex-col gap-1">
      <p className="font-bold">
        Axe {index + 2} - {axeNumberIndicator.nom}
      </p>
      {/* Automatic */}
      <div
        className="flex items-center gap-1"
        onClick={() => {
          setCheckedAxeAutomatic(true);
          setCheckedAxeNumber(false);
        }}
      >
        <input
          type="radio"
          name={`${axeNumberIndicator.id}-automatic`}
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxeAutomatic}
          onChange={() => {
            setCheckedAxeAutomatic(true);
            setCheckedAxeNumber(false);
          }}
        />
        <p>Automatique</p>
      </div>

      {/* Percentage */}
      <div
        className="flex items-center gap-1"
        onClick={() => {
          setCheckedAxeNumber(true);
          setCheckedAxeAutomatic(false);
        }}
      >
        <input
          type="radio"
          name={`${axeNumberIndicator.id}-percentage`}
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxeNumber}
          onChange={() => {
            setCheckedAxeNumber(true);
            setCheckedAxeAutomatic(false);
          }}
        />

        <div className="flex items-center gap-3">
          <span>De</span>
          <input
            type="number"
            min="0"
            max="999"
            name="precipitation-percentage-min"
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axeNumFrom}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxeNumFrom(0);
              } else if (+e.target.value > 999) {
                setAxeNumFrom(999);
              } else {
                setAxeNumFrom(e.target.value);
              }
            }}
          />
          <span>à</span>
          <input
            type="number"
            min="0"
            max="999"
            name="precipitation-percentage-max"
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axeNumTo}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxeNumTo(0);
              } else if (+e.target.value > 999) {
                setAxeNumTo(999);
              } else {
                setAxeNumTo(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AxeWidgetAutomaticNumber;
