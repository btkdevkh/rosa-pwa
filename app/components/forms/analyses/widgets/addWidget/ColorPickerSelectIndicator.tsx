import { Dispatch, SetStateAction, useEffect, useState } from "react";
import XBigIcon from "../../../../shared/icons/XBigIcon";
import SingleSelect from "../../../../selects/SingleSelect";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import toastError from "@/app/helpers/notifications/toastError";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import { Axe } from "@/app/models/interfaces/Axe";
import { AxeName, AxeUnite } from "@/app/models/enums/AxeEnum";

type ColorPickerSelectIndicatorProps = {
  index: number;
  count: number;
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

  const handleChangeColor = (color: string) => {
    setColor(color);
    setIndicators(prevs => {
      const copiedIndicators = [...prevs];
      copiedIndicators[index] = {
        ...copiedIndicators[index],
        color: color,
      };
      return copiedIndicators;
    });
  };

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

      // Create new indicator
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
        axe_nom: option.isPercentageAxe
          ? "Fréquence et intensité (%)"
          : option.value === "Humectation foliaire"
          ? AxeName.TENSION_V
          : option.value === "Humidité"
          ? AxeName.HUMIDITE
          : option.value === "Précipitations"
          ? AxeName.PRECIPITATIONS
          : option.value === "Température maximum"
          ? AxeName.TEMPERATURE_MAX
          : option.value,
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

        // Create new axe
        const newAxe = {
          id: newSelectedIndicator.id_axe as number,
          nom: newSelectedIndicator.isPercentageAxe
            ? "Fréquence et intensité (%)"
            : newSelectedIndicator.axe_nom,
          unite: newSelectedIndicator.isPercentageAxe
            ? AxeUnite.PERCENTAGE
            : newSelectedIndicator.nom === "Humectation foliaire"
            ? AxeUnite.TENSION_V
            : newSelectedIndicator.nom === "Humidité"
            ? AxeUnite.PERCENTAGE
            : newSelectedIndicator.nom === "Précipitations"
            ? AxeUnite.MM
            : newSelectedIndicator.nom === "Température maximum"
            ? AxeUnite.C
            : null,
          id_indicator: newSelectedIndicator.id_indicator,
          id_mocked_axe: newSelectedIndicator.id_axe,
          indicator_nom: newSelectedIndicator.nom,
          provenance: newSelectedIndicator.provenance,
          min: option.isPercentageAxe
            ? option.min_freq_obs
            : option.value === "Nombre de feuilles"
            ? option.min_num_obs
            : 0,
          max: option.isPercentageAxe
            ? option.max_freq_obs
            : option.value === "Nombre de feuilles"
            ? option.max_num_obs
            : 100,
        } as Axe;

        copiedAxes[index] = newAxe;
        return copiedAxes.filter(() => true); // Clear empty values
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators, index]);

  // Update color when update widget
  useEffect(() => {
    if (indicators && indicators.length > 0 && indicators[index]) {
      setColor(indicators[index].color as string);
    }
  }, [indicators, index]);

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
            onChange={e => handleChangeColor(e.target.value)}
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
