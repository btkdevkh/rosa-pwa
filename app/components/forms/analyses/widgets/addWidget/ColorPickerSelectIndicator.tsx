import { Dispatch, SetStateAction, useEffect, useState } from "react";
import XBigIcon from "../../../../shared/icons/XBigIcon";
import SingleSelect from "../../../../selects/SingleSelect";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import toastError from "@/app/helpers/notifications/toastError";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";

type ColorPickerSelectIndicatorProps = {
  index: number;
  count: number;
  indicatorColor: string;
  indicators: Indicateur[];
  indicatorOptions: OptionTypeIndicator[];
  setCount: Dispatch<SetStateAction<number>>;
  handleRemoveIndicator: (index: number) => void;
  setIndicators: Dispatch<SetStateAction<Indicateur[]>>;
};

const ColorPickerSelectIndicator = ({
  index,
  count,
  indicators,
  indicatorColor,
  indicatorOptions,
  setIndicators,
  handleRemoveIndicator,
}: ColorPickerSelectIndicatorProps) => {
  const [color, setColor] = useState<string>(indicatorColor);
  const [selectedIndicatorOption, setSelectedIndicatorOption] =
    useState<OptionTypeIndicator | null>(null);

  const handleGetSelectedOption = (
    optionIndictor: SetStateAction<OptionTypeIndicator | null>
  ) => {
    if (count > 3) return;

    const option = optionIndictor as OptionTypeIndicator;

    if (option) {
      // Check for duplicate option
      const isDuplicate = indicators?.some(
        indicator => indicator.id === option.id
      );
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
        id: option.id,
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
      };

      // Update indicators with new indicator when selected change
      setIndicators(prev => {
        const newIndicators = [...prev];
        newIndicators[index] = newSelectedIndicator;
        return newIndicators;
      });
    }
  };

  // Set selected option when indicators change
  useEffect(() => {
    if (indicators && indicators[index]) {
      const indicator = indicators[index];
      const option =
        indicatorOptions.find(opt => opt.id === indicator.id) || null;
      setSelectedIndicatorOption(option);
    } else {
      setSelectedIndicatorOption(null);
    }
  }, [indicators, index, indicatorOptions]);

  // Update color when it changes
  useEffect(() => {
    if (color) {
      setIndicators(prev => {
        const newIndicators = [...prev];
        newIndicators[index] = {
          ...newIndicators[index],
          color: color,
        };
        return newIndicators;
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
        <button type="button" onClick={() => handleRemoveIndicator(index)}>
          <XBigIcon />
        </button>
      </div>
    </>
  );
};

export default ColorPickerSelectIndicator;
