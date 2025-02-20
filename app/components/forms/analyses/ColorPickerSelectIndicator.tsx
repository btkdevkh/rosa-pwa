import { Dispatch, SetStateAction, useState } from "react";
import XBigIcon from "../../shared/icons/XBigIcon";
import SingleSelect from "../../selects/SingleSelect";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import toastError from "@/app/helpers/notifications/toastError";

type ColorPickerSelectIndicatorProps = {
  index: number;
  indicatorColor: string;
  indicators: Indicateur[];
  indicatorOptions: OptionTypeIndicator[];
  setCount: Dispatch<SetStateAction<number>>;
  setIndicators: Dispatch<SetStateAction<Indicateur[]>>;
  setParentIndicatorOptions: Dispatch<
    SetStateAction<OptionTypeIndicator[] | null>
  >;
  handleRemoveIndicator: (index: number) => void;
  formatIndicatorData: Indicateur[] | null;
  parentIndicatorOptions: OptionTypeIndicator[] | null;
};

const ColorPickerSelectIndicator = ({
  index,
  indicators,
  indicatorColor,
  setIndicators,
  setParentIndicatorOptions,
  handleRemoveIndicator,
  indicatorOptions,
  parentIndicatorOptions,
}: ColorPickerSelectIndicatorProps) => {
  const [color, setColor] = useState<string>(indicatorColor);
  const [selectedIndicatorOption, setSelectedIndicatorOption] =
    useState<OptionTypeIndicator | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [childIndicatorOptions, setChildIndicatorOptions] = useState<
    OptionTypeIndicator[] | null
  >(parentIndicatorOptions);

  const handleGetSelectedOption = (option: OptionTypeIndicator | null) => {
    if (indicators.length === 8) {
      return toastError(
        "Veuillez revoir les champs indiqués pour continuer",
        "error-inputs"
      );
    }

    if (option) {
      setSelectedIndicatorOption(option);

      // Update child option individually
      setChildIndicatorOptions(prevs => {
        return (prevs as OptionTypeIndicator[])?.filter(
          prev => prev.id !== option.id
        );
      });

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
      };
      console.log("newSelectedIndicator :", newSelectedIndicator);

      // Update parent indicator options
      setParentIndicatorOptions(prevs => [
        ...(prevs ?? []).filter(prev => prev.id !== newSelectedIndicator.id),
      ]);

      // Update indicators
      setIndicators(prevs => {
        return getUniqueObjectsByKey([...prevs, newSelectedIndicator], "nom");
      });
    }
  };

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
            data={parentIndicatorOptions ?? []}
            selectedOption={selectedIndicatorOption}
            isClearable={false}
            setSelectedOption={option => {
              handleGetSelectedOption(option as OptionTypeIndicator);
            }}
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

function filterMatchingIds<T extends { id: number | string }>(
  arr1: T[],
  arr2: T[]
): T[] {
  const idsSet = new Set(arr2.map(item => item.id));
  return arr1.filter(item => idsSet.has(item.id));
}

function filterById(array1: any[], array2: any[]): any[] {
  const uniqueArray1 = Array.from(
    new Map(array1.map(item => [item.id, item])).values()
  );
  const idsSet = new Set(array2.map(item => item.id));
  return uniqueArray1.filter(item => !idsSet.has(item.id));
}

export const getUniqueObjectsByKey = <T, K extends keyof T>(
  array: T[],
  key: K
): T[] => {
  const uniqueMap = new Map<T[K], T>();
  array.forEach(item => {
    uniqueMap.set(item[key], item);
  });
  return Array.from(uniqueMap.values());
};
