import { OptionType } from "../types/OptionType";
import { Dashboard } from "./Dashboard";

export interface OptionTypeDashboard extends OptionType {
  dashboard: Dashboard;
  had_dashboard: boolean;
}
