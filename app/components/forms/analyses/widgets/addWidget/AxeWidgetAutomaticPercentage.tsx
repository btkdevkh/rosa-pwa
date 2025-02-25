import { Axe } from "@/app/models/interfaces/Axe";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type AxeWidgetAutomaticPercentageProps = {
  axe: Axe;
  index: number;
  minFreq: string | number | null;
  maxFreq: string | number | null;
  minNum: string | number | null;
  maxNum: string | number | null;
  setAxes: Dispatch<SetStateAction<Axe[]>>;
};

const AxeWidgetAutomaticPercentage = ({
  axe,
  index,
  minFreq,
  maxFreq,
  minNum,
  maxNum,
  setAxes,
}: AxeWidgetAutomaticPercentageProps) => {
  const [checkedAxeAutomatic, setCheckedAxeAutomatic] = useState(true);
  const [checkedAxePercentage, setCheckedAxePercentage] = useState(false);
  const [axePercentageFrom, setAxePercentageFrom] = useState<number | string>(
    0
  );
  const [axePercentageTo, setAxePercentageTo] = useState<number | string>(100);

  const handleCheckedAxeAutomatic = () => {
    setCheckedAxeAutomatic(true);
    setCheckedAxePercentage(false);
  };

  const handleCheckedAxePercentage = () => {
    setCheckedAxePercentage(true);
    setCheckedAxeAutomatic(false);
  };

  useEffect(() => {
    if (!checkedAxeAutomatic && checkedAxePercentage) {
      setAxes(prevs => {
        const updatedAxes = [...prevs];
        const updatedAxe = prevs.find(
          prev => prev.id_indicator === axe.id_indicator
        );
        if (!updatedAxe) return prevs;
        updatedAxes[updatedAxes.indexOf(updatedAxe)] = {
          ...updatedAxe,
          min: +axePercentageFrom,
          max: +axePercentageTo,
        };
        return updatedAxes;
      });
    }

    if (!checkedAxePercentage && checkedAxeAutomatic) {
      setAxes(prevs => {
        const updatedAxes = [...prevs];
        const updatedAxe = prevs.find(
          prev => prev.id_indicator === axe.id_indicator
        );
        if (!updatedAxe) return prevs;
        updatedAxes[updatedAxes.indexOf(updatedAxe)] = {
          ...updatedAxe,
          min:
            updatedAxe.nom === "Fréquence et intensité (%)"
              ? minFreq || minFreq === 0
                ? (+minFreq as number)
                : null
              : minNum
              ? (+minNum as number)
              : null,
          max:
            updatedAxe.nom === "Fréquence et intensité (%)"
              ? maxFreq || maxFreq === 0
                ? (+maxFreq as number)
                : null
              : maxNum
              ? (+maxNum as number)
              : null,
        };
        return updatedAxes;
      });
    }
  }, [
    checkedAxePercentage,
    checkedAxeAutomatic,
    axePercentageFrom,
    axePercentageTo,
  ]);

  return (
    <div className="flex flex-col gap-1">
      <p className="font-bold">
        Axe {index + 1} - {axe.nom}
      </p>

      {/* Automatic */}
      <div
        className="flex items-center gap-1"
        onClick={handleCheckedAxeAutomatic}
      >
        <input
          type="radio"
          name={`axe-automatic-${axe?.id_indicator}`}
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxeAutomatic}
          onChange={handleCheckedAxeAutomatic}
        />
        <p className="">Automatique</p>
      </div>

      {/* Percentage */}
      <div
        className="flex items-center gap-1"
        onClick={handleCheckedAxePercentage}
      >
        <input
          type="radio"
          name={`axe-percentage-${axe?.id_indicator}`}
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxePercentage}
          onChange={handleCheckedAxePercentage}
        />

        <div className="flex items-center gap-3">
          <span>De</span>
          <input
            type="number"
            min="0"
            max="100"
            name="frequence-intensite-percentage-min"
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axePercentageFrom}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxePercentageFrom(0);
              } else if (+e.target.value > 100) {
                setAxePercentageFrom(100);
              } else {
                setAxePercentageFrom(+e.target.value);
              }
            }}
          />

          <span>à</span>

          <input
            type="number"
            min="0"
            max="100"
            name="frequence-intensite-percentage-max"
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axePercentageTo}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxePercentageTo(0);
              } else if (+e.target.value > 100) {
                setAxePercentageTo(100);
              } else {
                setAxePercentageTo(+e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AxeWidgetAutomaticPercentage;
