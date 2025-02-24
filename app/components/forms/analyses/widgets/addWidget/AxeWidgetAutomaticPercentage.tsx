import { Axe } from "@/app/models/interfaces/Axe";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import useGetObservationsByPeriod from "@/app/hooks/observations/useGetObservationsByPeriod";

type AxeWidgetAutomaticPercentageProps = {
  selectedIndicator: Indicateur | null;
  dateRange?: [Date | null, Date | null] | null | undefined;
  dateModeAuto?: string | null | undefined;
  checkedDateModeAuto?: boolean;
  setAxes: Dispatch<SetStateAction<Axe[]>>;
};

const AxeWidgetAutomaticPercentage = ({
  selectedIndicator,
  dateRange,
  dateModeAuto,
  checkedDateModeAuto,
  setAxes,
}: AxeWidgetAutomaticPercentageProps) => {
  const { explID, dashboardID } = useCustomExplSearchParams();
  const { minFreq, maxFreq } = useGetObservationsByPeriod(
    explID,
    dashboardID,
    dateRange,
    dateModeAuto,
    checkedDateModeAuto
  );
  const [checkedAxeAutomatic, setCheckedAxeAutomatic] = useState(true);
  const [checkedAxePercentage, setCheckedAxePercentage] = useState(false);
  const [axePercentageFrom, setAxePercentageFrom] = useState<number | string>(
    0
  );
  const [axePercentageTo, setAxePercentageTo] = useState<number | string>(100);

  // useEffect(() => {
  //   setAxes(prevs => {
  //     return [
  //       ...prevs,
  //       {
  //         nom: "Axe 1 - Fréquence et intensité (%)",
  //         min: checkedAxeAutomatic ? minFreq : +axePercentageFrom,
  //         max: checkedAxeAutomatic ? maxFreq : +axePercentageTo,
  //         unite: "%",
  //         id_indicator: selectedIndicator?.id,
  //       },
  //     ] as Axe[];
  //   });
  // }, [
  //   minFreq,
  //   maxFreq,
  //   setAxes,
  //   selectedIndicator,
  //   checkedAxeAutomatic,
  //   axePercentageFrom,
  //   axePercentageTo,
  // ]);

  useEffect(() => {
    // @todo: filtered duplicated axes
    setAxes(prevs => {
      const newAxe = {
        nom: "Axe 1 - Fréquence et intensité (%)",
        min: checkedAxeAutomatic ? minFreq : +axePercentageFrom,
        max: checkedAxeAutomatic ? maxFreq : +axePercentageTo,
        unite: "%",
        id_indicator: selectedIndicator?.id,
      };

      // Check if the newAxe already exists in the array
      const exists = prevs.some(
        axe =>
          axe.nom === newAxe.nom && axe.id_indicator === newAxe.id_indicator
      );

      if (exists) {
        // If it exists, update the existing object
        return prevs.map(axe =>
          axe.nom === newAxe.nom && axe.id_indicator === newAxe.id_indicator
            ? newAxe
            : axe
        ) as Axe[];
      } else {
        // If it doesn't exist, add the new object
        return [...prevs, newAxe] as Axe[];
      }
    });
  }, [
    minFreq,
    maxFreq,
    setAxes,
    selectedIndicator,
    checkedAxeAutomatic,
    axePercentageFrom,
    axePercentageTo,
  ]);

  return (
    <div className="flex flex-col gap-1">
      <p className="font-bold">Axe 1 - Fréquence et intensité (%)</p>

      {/* Automatic */}
      <div
        className="flex items-center gap-1"
        onClick={() => {
          setCheckedAxeAutomatic(true);
          setCheckedAxePercentage(false);
        }}
      >
        <input
          type="radio"
          name="frequence-intensite-automatic"
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxeAutomatic}
          onChange={() => {
            setCheckedAxeAutomatic(true);
            setCheckedAxePercentage(false);
          }}
        />
        <p className="">Automatique</p>
      </div>

      {/* Percentage */}
      <div
        className="flex items-center gap-1"
        onClick={() => {
          setCheckedAxePercentage(true);
          setCheckedAxeAutomatic(false);
        }}
      >
        <input
          type="radio"
          name="frequence-intensite-percentage"
          className="mr-2 radio radio-sm checked:bg-primary"
          checked={checkedAxePercentage}
          onChange={() => {
            setCheckedAxePercentage(true);
            setCheckedAxeAutomatic(false);
          }}
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
                setAxePercentageFrom(e.target.value);
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
                setAxePercentageTo(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AxeWidgetAutomaticPercentage;
