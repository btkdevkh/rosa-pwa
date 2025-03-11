import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AxeUnite } from "@/app/models/enums/AxeEnum";
import { Axe } from "@/app/models/interfaces/Axe";
import { Widget } from "@/app/models/interfaces/Widget";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";

type AxeWidgetAutomaticPercentageProps = {
  index: number;
  axe?: Axe | null;
  widget?: Widget | null;
  minAxeWidget?: string | number | null;
  maxAxeWidget?: string | number | null;
  minFreqObs?: string | number | null;
  maxFreqObs?: string | number | null;
  minNumObs: string | number | null;
  maxNumObs: string | number | null;
  setAxes: Dispatch<SetStateAction<Axe[]>>;
  inputErrors?: {
    [key: string]: string;
  } | null;
};

const AxeWidgetAutomaticPercentage = ({
  axe,
  index,
  widget,
  minAxeWidget,
  maxAxeWidget,
  setAxes,
  maxNumObs,
  minNumObs,
  minFreqObs,
  maxFreqObs,
  inputErrors,
}: AxeWidgetAutomaticPercentageProps) => {
  const [checkedAxeAutomatic, setCheckedAxeAutomatic] = useState(true);
  const [checkedAxePercentage, setCheckedAxePercentage] = useState(false);
  const [axePercentageFrom, setAxePercentageFrom] = useState<number | string>(
    minAxeWidget ?? 0
  );
  const [axePercentageTo, setAxePercentageTo] = useState<number | string>(
    maxAxeWidget ?? 100
  );

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
      console.log("checkedAxeAutomatic", checkedAxeAutomatic);

      setAxes(prevs => {
        const copiedAxes = [...prevs];

        return copiedAxes.map(copiedAxe => {
          if (copiedAxe?.nom === axe?.nom) {
            // Pour l'instant on ne prend que les indicateurs hors Weenat
            const minAuto =
              copiedAxe?.provenance !== "Weenat" &&
              copiedAxe?.unite === AxeUnite.PERCENTAGE
                ? minFreqObs
                : copiedAxe.nom === "Nombre de feuilles"
                ? minNumObs
                : 0;

            const maxAuto =
              copiedAxe?.provenance !== "Weenat" &&
              copiedAxe?.unite === AxeUnite.PERCENTAGE
                ? maxFreqObs
                : copiedAxe.nom === "Nombre de feuilles"
                ? maxNumObs
                : 0;

            return {
              ...copiedAxe,
              min: minAuto,
              max: maxAuto,
            };
          }

          return copiedAxe;
        }) as Axe[];
      });
    }
  }, [
    maxFreqObs,
    minFreqObs,
    minNumObs,
    maxNumObs,
    minAxeWidget,
    maxAxeWidget,
    setAxes,
    axe?.nom,
    axePercentageTo,
    axePercentageFrom,
    checkedAxePercentage,
    checkedAxeAutomatic,
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
              min: axePercentageFrom,
              max: axePercentageTo,
            };
          }
          return copiedAxe;
        }) as Axe[];
      });
    }
  }, [
    widget,
    minNumObs,
    maxNumObs,
    minAxeWidget,
    maxAxeWidget,
    setAxes,
    axe?.nom,
    minFreqObs,
    maxFreqObs,
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
          name={`axe-automatic-${axe?.id}`}
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
          name={`axe-percentage-${axe?.id}`}
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxePercentage}
          onChange={handleCheckedAxePercentage}
        />

        <div className="flex items-center gap-3">
          <span>De</span>
          <input
            type="number"
            min="0"
            max="999"
            name={`frequence-intensite-percentage-min-${axe?.id}`}
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axePercentageFrom}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxePercentageFrom(0);
              } else if (+e.target.value > 999) {
                setAxePercentageFrom(999);
              } else {
                setAxePercentageFrom(e.target.value);
              }
            }}
          />

          <span>à</span>

          <input
            type="number"
            min="0"
            max="999"
            name={`frequence-intensite-percentage-max-${axe?.id}`}
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axePercentageTo}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxePercentageTo(0);
              } else if (+e.target.value > 999) {
                setAxePercentageTo(999);
              } else {
                setAxePercentageTo(e.target.value);
              }
            }}
          />
        </div>
      </div>

      {/* Error */}
      <ErrorInputForm
        inputErrors={inputErrors ?? null}
        property={`axeMinMax-${axe?.id}`}
      />
    </div>
  );
};

export default AxeWidgetAutomaticPercentage;
