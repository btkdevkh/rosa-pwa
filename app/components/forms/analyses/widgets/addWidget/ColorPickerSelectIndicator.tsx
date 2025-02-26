import { Dispatch, SetStateAction, useEffect, useState } from "react";
import XBigIcon from "../../../../shared/icons/XBigIcon";
import SingleSelect from "../../../../selects/SingleSelect";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import toastError from "@/app/helpers/notifications/toastError";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import { Axe } from "@/app/models/interfaces/Axe";

type ColorPickerSelectIndicatorProps = {
  index: number;
  count: number;
  minFreq: string | number | null;
  maxFreq: string | number | null;
  minNum: string | number | null;
  maxNum: string | number | null;
  indicatorColor: string;
  indicators: Indicateur[];
  indicatorOptions: OptionTypeIndicator[];
  setAxes: Dispatch<SetStateAction<Axe[]>>;
  setCount: Dispatch<SetStateAction<number>>;
  handleRemoveIndicator: (
    index: number,
    indicator: OptionTypeIndicator | null
  ) => void;
  setIndicators: Dispatch<SetStateAction<Indicateur[]>>;
  setSelectedIndicator: Dispatch<SetStateAction<Indicateur | null>>;
};

const ColorPickerSelectIndicator = ({
  index,
  minFreq,
  maxFreq,
  minNum,
  maxNum,
  indicators,
  indicatorColor,
  indicatorOptions,
  setAxes,
  setIndicators,
  handleRemoveIndicator,
  setSelectedIndicator,
}: ColorPickerSelectIndicatorProps) => {
  const [color, setColor] = useState<string>(indicatorColor);
  const [selectedIndicatorOption, setSelectedIndicatorOption] =
    useState<OptionTypeIndicator | null>(null);

  const handleGetSelectedOption = (
    optionIndictor: SetStateAction<OptionTypeIndicator | null>
  ) => {
    const option = optionIndictor as OptionTypeIndicator;

    if (option) {
      const isDuplicate = indicators?.some(
        indicator => indicator.id_indicator === option.id
      );

      // Check for duplicate option
      if (isDuplicate) {
        return toastError(
          "L'indicateur est déja sélectionné.",
          "duplicated-indicator"
        );
      }

      if (option.provenance === "Weenat") {
        toastError(
          "Veuillez vous connecter à votre compte Weenat pour voir la météo.",
          "weenat-indicator"
        );
      }

      setSelectedIndicatorOption(option);

      const newSelectedIndicator: Indicateur = {
        id_indicator: option.id,
        nom: option.value,
        params: {
          source: "SRC",
        },
        data_field: null,
        type_viz: null,
        id_axe: option.id_axe ?? null,
        color: color,
        isPercentageAxe: option.isPercentageAxe,
        isNumberAxe: option.isNumberAxe,
        provenance: option.provenance,
      };

      setSelectedIndicator(newSelectedIndicator);

      // Update indicators with new indicator when selected change
      setIndicators(prevs => {
        const copiedIndicators = [...prevs];
        copiedIndicators[index] = newSelectedIndicator;
        return copiedIndicators;
      });

      // Update axe
      setAxes(prevs => {
        const copiedAxes = [...prevs];

        // Pour l'instant on ne prend que les indicateurs hors Weenat
        const minHorsWeenat =
          newSelectedIndicator.provenance !== "Weenat" ? minNum : null;
        const maxHorsWeenat =
          newSelectedIndicator.provenance !== "Weenat" ? maxNum : null;

        // Axe object
        const newAxe = {
          id: newSelectedIndicator.id_axe as number,
          nom: newSelectedIndicator.isPercentageAxe
            ? "Fréquence et intensité (%)"
            : newSelectedIndicator.nom,
          min: newSelectedIndicator.isPercentageAxe ? minFreq : minHorsWeenat,
          max: newSelectedIndicator.isPercentageAxe ? maxFreq : maxHorsWeenat,
          unite: newSelectedIndicator.isPercentageAxe ? "%" : null,
          id_indicator: newSelectedIndicator.id_indicator,
        } as Axe;

        copiedAxes[index] = newAxe;
        return copiedAxes;
      });
    }
  };

  // Set selected option when indicators change
  useEffect(() => {
    if (indicators && indicators[index]) {
      const indicator = indicators[index];
      const option =
        indicatorOptions.find(opt => opt.id === indicator.id_indicator) || null;
      setSelectedIndicatorOption(option);
    } else {
      setSelectedIndicatorOption(null);
    }
  }, [indicators, index, indicatorOptions]);

  // Update color when it changes
  useEffect(() => {
    if (color) {
      setIndicators(prev => {
        const copiedIndicators = [...prev];
        copiedIndicators[index] = {
          ...copiedIndicators[index],
          color: color,
        };
        return copiedIndicators;
      });
    }
  }, [color, index, setIndicators]);

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        {/* Color picker input */}
        <div>
          <input
            className="input-ghost h-7 w-6"
            type="color"
            name="color-1"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
        </div>

        {/* Select Indicator */}
        <div className="w-full">
          <SingleSelect
            data={indicatorOptions ?? []}
            selectedOption={selectedIndicatorOption}
            isClearable={false}
            setSelectedOption={handleGetSelectedOption}
            setIsClearable={() => {}}
          />
        </div>

        {/* X */}
        <button
          type="button"
          onClick={() => handleRemoveIndicator(index, selectedIndicatorOption)}
        >
          <XBigIcon />
        </button>
      </div>
    </>
  );
};

export default ColorPickerSelectIndicator;
