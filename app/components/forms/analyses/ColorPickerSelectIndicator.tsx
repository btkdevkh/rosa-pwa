import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SingleSelect from "../../selects/SingleSelect";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import XBigIcon from "../../shared/icons/XBigIcon";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";

type ColorPickerSelectIndicatorProps = {
  index: number;
  indicator: Indicateur;
  indicatorColor: string;
  indicatorOptions: OptionTypeIndicator[];
  setIndicators: Dispatch<SetStateAction<Indicateur[] | null>>;
};

const ColorPickerSelectIndicator = ({
  index,
  indicator,
  indicatorColor,
  setIndicators,
  indicatorOptions,
}: ColorPickerSelectIndicatorProps) => {
  const [color, setColor] = useState<string>(indicatorColor ?? "");
  const [selectedOption, setSelectedOption] =
    useState<OptionTypeIndicator | null>(null);

  // Track indicators
  useEffect(() => {
    if (selectedOption) {
      const newChangedIndicator: Indicateur = {
        id: selectedOption.id,
        nom: selectedOption.value,
        params: {
          source: "SRC",
        },
        data_field: null,
        type_viz: null,
        id_axe: selectedOption.id_axe ?? null,
        color: color,
      };

      // Upadte indicators
      setIndicators(prevs => {
        const updatedIndicators = prevs as Indicateur[];
        updatedIndicators[index] = newChangedIndicator;
        return updatedIndicators;
      });
    }
  }, [setIndicators, selectedOption, color]);

  const handleRemoveIndicator = (index: number) => {
    console.log("index :", index);
  };

  console.log("color :", color);
  console.log("selectedOption :", selectedOption);

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
            data={indicatorOptions}
            selectedOption={selectedOption}
            isClearable={false}
            setSelectedOption={option => setSelectedOption(option)}
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
