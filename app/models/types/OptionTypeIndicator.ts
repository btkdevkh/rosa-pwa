// Define the type for your options
export type OptionTypeIndicator = {
  id: number | string;
  value: string;
  label: string;
  id_axe?: number | null;
  color?: string | null;
  provenance?: string | null;
  isPercentageAxe?: boolean | null;
  isNumberAxe?: boolean | null;
  id_indicator?: string | number | null;
};
