import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Axe } from "@/app/models/interfaces/Axe";
import { Widget } from "@/app/models/interfaces/Widget";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";
import { OptionType } from "@/app/models/types/OptionType";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import { AxeUnite } from "@/app/models/enums/AxeEnum";

type AxeWidgetAutomaticManualProps = {
  index: number;
  startDate: Date | null;
  endDate: Date | null;
  axe?: Axe | null;
  widget?: Widget | null;
  selectedPeriod?:
    | OptionType
    | OptionTypeDashboard
    | OptionTypeIndicator
    | null;
  checkedPeriod2?: boolean;
  selectedPlot?: OptionType | null;
  inputErrors?: {
    [key: string]: string;
  } | null;
  setAxes: Dispatch<SetStateAction<Axe[]>>;
};

const AxeWidgetAutomaticManual = ({
  axe,
  index,
  widget,
  inputErrors,
  setAxes,
}: AxeWidgetAutomaticManualProps) => {
  const [checkedAxeAutomatic, setCheckedAxeAutomatic] = useState(
    axe && axe.automatic ? true : false
  );
  const [checkedAxeNumber, setCheckedAxeNumber] = useState(
    axe && axe.automatic ? false : true
  );
  const [axeManualFrom, setAxeManualFrom] = useState<number | string>(0);
  const [axeManualTo, setAxeManualTo] = useState<number | string>(100);

  const handleCheckedAxeAutomatic = () => {
    setCheckedAxeAutomatic(true);
    setCheckedAxeNumber(false);
  };

  const handleCheckedAxeNumber = () => {
    setCheckedAxeNumber(true);
    setCheckedAxeAutomatic(false);
  };

  // checkedAxePercentage is checked
  // Get min and max values from widget params
  useEffect(() => {
    if (widget && checkedAxeNumber && !checkedAxeAutomatic) {
      const minMaxAxes = widget.params.indicateurs?.find(
        indicateur => indicateur.id === axe?.id_indicator
      )?.min_max;

      if (minMaxAxes && minMaxAxes.length > 0) {
        setAxeManualFrom(minMaxAxes[0]);
        setAxeManualTo(minMaxAxes[1]);
      }
    }
  }, [widget, checkedAxeNumber, checkedAxeAutomatic, axe?.id_indicator]);

  // checkedAxeAutomatic is checked
  useEffect(() => {
    if (!checkedAxeNumber && checkedAxeAutomatic) {
      setAxes(prevs => {
        const copiedAxes = [...prevs];
        return copiedAxes.map(copiedAxe => {
          if (copiedAxe?.nom === axe?.nom) {
            return {
              ...copiedAxe,
              min: +axeManualFrom,
              max: +axeManualTo,
              automatic: true,
            };
          }

          return copiedAxe;
        }) as Axe[];
      });
    }
  }, [
    setAxes,
    axe?.nom,
    axeManualTo,
    axeManualFrom,
    checkedAxeNumber,
    checkedAxeAutomatic,
  ]);

  // checkedAxePercentage is checked
  useEffect(() => {
    if (!checkedAxeAutomatic && checkedAxeNumber) {
      setAxes(prevs => {
        const copiedAxes = [...prevs];
        return copiedAxes.map(copiedAxe => {
          if (copiedAxe.nom === axe?.nom) {
            return {
              ...copiedAxe,
              min: +axeManualFrom,
              max: +axeManualTo,
              automatic: false,
            };
          }
          return copiedAxe;
        }) as Axe[];
      });
    }
  }, [
    widget,
    setAxes,
    axe?.nom,
    axeManualTo,
    axeManualFrom,
    checkedAxeAutomatic,
    checkedAxeNumber,
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
      <div className="flex items-center gap-1" onClick={handleCheckedAxeNumber}>
        <input
          type="radio"
          name={`axe-percentage-${axe?.id_indicator}`}
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxeNumber}
          onChange={handleCheckedAxeNumber}
        />

        <div className="flex items-center gap-3">
          <span>De</span>
          <input
            type="number"
            min="0"
            max={axe?.unite === AxeUnite.PERCENTAGE ? 100 : 999}
            name={`frequence-intensite-percentage-min-${axe?.id_indicator}`}
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axeManualFrom}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxeManualFrom(0);
              } else if (
                axe?.unite === AxeUnite.PERCENTAGE &&
                +e.target.value > 100
              ) {
                setAxeManualFrom(100);
              } else if (
                axe?.nom === "Nombre de feuilles" &&
                +e.target.value > 999
              ) {
                setAxeManualFrom(999);
              } else {
                setAxeManualFrom(e.target.value);
              }
            }}
          />

          <span>à</span>

          <input
            type="number"
            min="0"
            max={axe?.unite === AxeUnite.PERCENTAGE ? 100 : 999}
            name={`frequence-intensite-percentage-max-${axe?.id_indicator}`}
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axeManualTo}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxeManualTo(0);
              } else if (
                axe?.unite === AxeUnite.PERCENTAGE &&
                +e.target.value > 100
              ) {
                setAxeManualTo(100);
              } else if (
                axe?.nom === "Nombre de feuilles" &&
                +e.target.value > 999
              ) {
                setAxeManualTo(999);
              } else {
                setAxeManualTo(e.target.value);
              }
            }}
          />
        </div>
      </div>

      {/* Error */}
      <ErrorInputForm
        inputErrors={inputErrors ?? null}
        property={`axeMinMax-${axe?.id_indicator}`}
      />
    </div>
  );
};

export default AxeWidgetAutomaticManual;
