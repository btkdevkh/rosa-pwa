import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";
import { OptionType } from "@/app/models/types/OptionType";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import { Dispatch, SetStateAction } from "react";
import Select, { StylesConfig } from "react-select";

type SingleSelectProps = {
  isClearable: boolean;
  data: OptionType[] | OptionTypeDashboard[] | OptionTypeIndicator[];
  selectedOption: OptionType | OptionTypeDashboard | OptionTypeIndicator | null;
  setSelectedOption: Dispatch<
    SetStateAction<
      OptionType | OptionTypeDashboard | OptionTypeIndicator | null
    >
  >;
  setIsClearable: (bool: boolean) => void;
  placeHolder?: string;
};

const SingleSelect = ({
  isClearable,
  data,
  selectedOption,
  setSelectedOption,
  setIsClearable,
  placeHolder,
}: SingleSelectProps) => {
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      value={selectedOption}
      isClearable={isClearable}
      isSearchable={true}
      options={data}
      styles={customStyles} // Apply custom styles
      noOptionsMessage={() => "Aucune entrée"}
      placeholder={placeHolder ?? ""}
      onChange={(option) => {
        setSelectedOption(
          option as
            | OptionType
            | OptionTypeDashboard
            | OptionTypeIndicator
            | null
        );
        setIsClearable(true);
      }}
    />
  );
};

export default SingleSelect;

// Define custom styles
const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#9d6cba" : "#9A9A9A", // Change focus border color
    boxShadow: state.isFocused ? "0 0 0 1px #9d6cba" : "none", // Add focus outline
    "&:hover": {
      borderColor: state.isFocused ? "#9d6cba" : "", // Change border color on hover
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#bd90d6"
      : state.isFocused
      ? "#bd90d6" // Background color when option is focused/hovered
      : "#FFF", // Default background color
    color: state.isSelected ? "#2C3E50" : "#2C3E50", // Text color for selected option
    "&:active": {
      backgroundColor: "#F8A8DB",
    },
  }),
};
