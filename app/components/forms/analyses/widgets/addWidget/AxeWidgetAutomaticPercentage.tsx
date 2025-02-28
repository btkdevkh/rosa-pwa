import { Axe } from "@/app/models/interfaces/Axe";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";

type AxeWidgetAutomaticPercentageProps = {
  axe?: Axe | null;
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
    // If checkedAxeAutomatic is checked
    if (!checkedAxePercentage && checkedAxeAutomatic) {
      setAxes(prevs => {
        const copiedAxes = [...prevs];

        return copiedAxes.map(copiedAxe => {
          if (copiedAxe.nom === axe?.nom) {
            // Pour l'instant on ne prend que les indicateurs hors Weenat
            const minHorsWeenat =
              copiedAxe.provenance !== "Weenat" ? minNum : null;
            const maxHorsWeenat =
              copiedAxe.provenance !== "Weenat" ? maxNum : null;

            return {
              ...copiedAxe,
              // min:
              //   copiedAxe.unite === AxeUnite.PERCENTAGE
              //     ? +axePercentageFrom
              //     : minHorsWeenat,
              // max:
              //   copiedAxe.unite === AxeUnite.PERCENTAGE
              //     ? +axePercentageTo
              //     : maxHorsWeenat,
              min: +axePercentageFrom,
              max: +axePercentageTo,
            };
          }

          return copiedAxe;
        }) as Axe[];
      });
    }
  }, [
    minFreq,
    maxFreq,
    minNum,
    maxNum,
    setAxes,
    axe?.nom,
    checkedAxeAutomatic,
    checkedAxePercentage,
    axePercentageFrom,
    axePercentageTo,
  ]);

  useEffect(() => {
    // If checkedAxePercentage is checked
    if (!checkedAxeAutomatic && checkedAxePercentage) {
      setAxes(prevs => {
        const copiedAxes = [...prevs];

        return copiedAxes.map(copiedAxe => {
          if (copiedAxe.nom === axe?.nom) {
            return {
              ...copiedAxe,
              min: +axePercentageFrom,
              max: +axePercentageTo,
            };
          }
          return copiedAxe;
        }) as Axe[];
      });
    }
  }, [
    minFreq,
    maxFreq,
    minNum,
    maxNum,
    setAxes,
    axe?.nom,
    axePercentageTo,
    axePercentageFrom,
    checkedAxeAutomatic,
    checkedAxePercentage,
  ]);

  return (
    <div className={`flex flex-col gap-1`}>
      <p className="font-bold">
        Axe {index + 1} - {axe?.nom}
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
