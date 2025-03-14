import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Axe } from "@/app/models/interfaces/Axe";
import { Widget } from "@/app/models/interfaces/Widget";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";
import useGetObservationsByPeriod from "@/app/hooks/observations/useGetObservationsByPeriod";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { OptionType } from "@/app/models/types/OptionType";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";

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
  startDate,
  endDate,
  selectedPeriod,
  checkedPeriod2,
  selectedPlot,
  inputErrors,
  setAxes,
}: AxeWidgetAutomaticManualProps) => {
  const { explID, dashboardID } = useCustomExplSearchParams();

  const [checkedAxeAutomatic, setCheckedAxeAutomatic] = useState(true);
  const [checkedAxePercentage, setCheckedAxePercentage] = useState(false);
  const [axeManualFrom, setAxeManualFrom] = useState<number | string>(0);
  const [axeManualTo, setAxeManualTo] = useState<number | string>(100);

  const { fromToAxe, nombreDeFeuillesAxe } = useGetObservationsByPeriod(
    explID,
    dashboardID,
    [startDate, endDate],
    selectedPeriod?.value,
    checkedPeriod2,
    selectedPlot?.id,
    widget?.id
  );

  const handleCheckedAxeAutomatic = () => {
    setCheckedAxeAutomatic(true);
    setCheckedAxePercentage(false);
  };

  const handleCheckedAxePercentage = () => {
    setCheckedAxePercentage(true);
    setCheckedAxeAutomatic(false);
  };

  // Update axe min and max values
  useEffect(() => {
    if (
      checkedAxeAutomatic &&
      axe?.nom === "Fréquence et intensité (%)" &&
      fromToAxe
    ) {
      setAxeManualFrom(fromToAxe.min);
      setAxeManualTo(fromToAxe.max);
    } else if (axe?.nom === "Nombre de feuilles" && nombreDeFeuillesAxe) {
      setAxeManualFrom(nombreDeFeuillesAxe.min);
      setAxeManualTo(nombreDeFeuillesAxe.max);
    }
  }, [axe?.nom, nombreDeFeuillesAxe, fromToAxe, checkedAxeAutomatic]);

  // checkedAxePercentage is checked
  // Get min and max values from widget params
  useEffect(() => {
    if (widget && checkedAxePercentage && !checkedAxeAutomatic) {
      const minMaxAxes = widget.params.indicateurs?.find(
        indicateur => indicateur.id === axe?.id_indicator
      )?.min_max;

      if (minMaxAxes && minMaxAxes.length > 0) {
        console.log("minMaxAxes :", minMaxAxes);

        setAxeManualFrom(minMaxAxes[0]);
        setAxeManualTo(minMaxAxes[1]);
      }
    }
  }, [widget, checkedAxePercentage, checkedAxeAutomatic, axe?.id_indicator]);

  // checkedAxeAutomatic is checked
  useEffect(() => {
    if (!checkedAxePercentage && checkedAxeAutomatic) {
      setAxes(prevs => {
        const copiedAxes = [...prevs];
        return copiedAxes.map(copiedAxe => {
          if (copiedAxe?.nom === axe?.nom) {
            return {
              ...copiedAxe,
              min: +axeManualFrom,
              max: +axeManualTo,
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
    checkedAxePercentage,
    checkedAxeAutomatic,
  ]);

  // checkedAxePercentage is checked
  useEffect(() => {
    if (!checkedAxeAutomatic && checkedAxePercentage) {
      setAxes(prevs => {
        const copiedAxes = [...prevs];
        return copiedAxes.map(copiedAxe => {
          if (copiedAxe.nom === axe?.nom) {
            return {
              ...copiedAxe,
              min: +axeManualFrom,
              max: +axeManualTo,
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
    checkedAxePercentage,
  ]);

  console.log("axe :", axe);
  console.log("widget :", widget);
  console.log("fromToAxe :", fromToAxe);
  console.log("nombreDeFeuillesAxe :", nombreDeFeuillesAxe);
  console.log("axeManualFrom :", axeManualFrom);
  console.log("axeManualTo :", axeManualTo);

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
            max="999"
            name={`frequence-intensite-percentage-min-${axe?.id_indicator}`}
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axeManualFrom}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxeManualFrom(0);
              } else if (+e.target.value > 999) {
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
            max="999"
            name={`frequence-intensite-percentage-max-${axe?.id_indicator}`}
            className="input input-primary input-sm focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md w-12 p-2"
            value={axeManualTo}
            onChange={e => {
              if (+e.target.value < 0) {
                setAxeManualTo(0);
              } else if (+e.target.value > 999) {
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
