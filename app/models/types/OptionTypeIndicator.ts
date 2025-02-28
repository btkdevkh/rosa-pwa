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
  min_freq_obs?: string | number | null;
  max_freq_obs?: string | number | null;
  min_num_obs?: string | number | null;
  max_num_obs?: string | number | null;
};
