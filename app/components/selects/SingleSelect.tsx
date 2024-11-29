import React, { useContext, useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { ExploitationContext } from "@/app/context/ExploitationContext";

type SingleSelectProps = {
  data: OptionType[];
};

const SingleSelect = ({ data }: SingleSelectProps) => {
  const { selectedExploitationOption, handleSelectedExploitationOption } =
    useContext(ExploitationContext);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    selectedExploitationOption ?? data[0]
  );

  useEffect(() => {
    if (selectedOption) {
      handleSelectedExploitationOption(selectedOption);
    }
  }, [selectedOption, handleSelectedExploitationOption]);

  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      value={selectedOption}
      isClearable={true}
      isSearchable={true}
      options={data}
      styles={customStyles} // Apply custom styles
      noOptionsMessage={() => "Aucune entrée"}
      onChange={option => setSelectedOption(option as OptionType)}
    />
  );
};

export default SingleSelect;

// Define the type for your options
export type OptionType = {
  value: string;
  label: string;
  uid: string;
};

// Define custom styles
const customStyles: StylesConfig = {
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
