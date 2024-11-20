import React from "react";
import Select, { GroupBase, OptionsOrGroups, StylesConfig } from "react-select";

type SingleSelectProps = {
  data: OptionsOrGroups<OptionType, GroupBase<OptionType>>;
};

const SingleSelect = ({ data }: SingleSelectProps) => {
  return (
    <Select<OptionType, false, GroupBase<OptionType>>
      className="basic-single"
      classNamePrefix="select"
      defaultValue={data[0] as OptionType}
      isClearable={true}
      isSearchable={true}
      options={data}
      styles={customStyles} // Apply custom styles
      noOptionsMessage={() => "Aucune entrée"}
    />
  );
};

export default SingleSelect;

// Define the type for your options
export type OptionType = {
  value: string;
  label: string;
};

// Define custom styles
const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#D63185" : "#9A9A9A", // Change focus border color
    boxShadow: state.isFocused ? "0 0 0 1px #D63185" : "none", // Add focus outline
    "&:hover": {
      borderColor: state.isFocused ? "#D63185" : "", // Change border color on hover
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#E287E3" // Background color for selected option
      : state.isFocused
      ? "#E287E3" // Background color when option is focused/hovered
      : "#FFF", // Default background color
    color: state.isSelected ? "#2C3E50" : "#2C3E50", // Text color for selected option
    "&:active": {
      backgroundColor: "#E287E3", // Background color when option is clicked
    },
  }),
};
