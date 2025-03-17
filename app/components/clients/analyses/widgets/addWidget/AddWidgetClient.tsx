"use client";

import {
  FormEvent,
  useEffect,
  useState,
  use,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Widget,
  WidgetHauteurEnum,
  WidgetTypeEnum,
} from "@/app/models/interfaces/Widget";
import { fr } from "date-fns/locale/fr";
import { useRouter } from "next/navigation";
import { Axe } from "@/app/models/interfaces/Axe";
import "react-datepicker/dist/react-datepicker.css";
import addWidget from "@/app/actions/widgets/addWidget";
import { OptionType } from "@/app/models/types/OptionType";
import { indicateurs, periodsType } from "@/app/mockedData";
import DatePicker, { registerLocale } from "react-datepicker";
import { Dashboard } from "@/app/models/interfaces/Dashboard";
import Loading from "@/app/components/shared/loaders/Loading";
import DateIcon from "@/app/components/shared/icons/DateIcon";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import toastError from "@/app/helpers/notifications/toastError";
import SingleSelect from "@/app/components/selects/SingleSelect";
import addDashboard from "@/app/actions/dashboards/addDashboard";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import stripSpaceLowerSTR from "@/app/helpers/stripSpaceLowerSTR";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";
import useGetIndicators from "@/app/hooks/indicators/useGetIndicators";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import AddPlusBigIcon from "@/app/components/shared/icons/AddPlusBigIcon";
import { DataVisualization } from "@/app/models/enums/DataVisualization";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";
import useUserExploitations from "@/app/hooks/exploitations/useUserExploitations";
import useGetAxes from "@/app/hooks/axes/useGetAxes";
import addAxe from "@/app/actions/axes/addAxe";
import addIndicator from "@/app/actions/indicateurs/addIndicator";
import ColorPickerSelectIndicator from "@/app/components/forms/analyses/widgets/ColorPickerSelectIndicator";
import AxeWidgetAutomaticManual from "@/app/components/forms/analyses/widgets/AxeWidgetAutomaticManual";
import { AxeMinMaxEnum } from "@/app/models/enums/AxeEnum";
import useGetPlots from "@/app/hooks/plots/useGetPlots";
import removeDuplicatesAxe from "@/app/helpers/removeDuplicatesAxe";

registerLocale("fr", fr);

const AddWidgetClient = () => {
  const router = useRouter();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { exploitations } = useUserExploitations();
  const { loading, indicators: indicatorData } = useGetIndicators();
  const { plots: plotData } = useGetPlots(explID);
  const { axes: axeData } = useGetAxes();
  const { handleSelectedExploitationOption } = use(ExploitationContext);

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;
  const pathUrl = `${MenuUrlPath.ANALYSES}/?${explQueries}`;

  // States
  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [inputErrors, setInputErrors] = useState<{
    [key: string]: string;
  } | null>(null);

  const [isClearable, setIsClearable] = useState(false);
  const [checkedPeriod1, setCheckedPeriod1] = useState(true);
  const [checkedPeriod2, setCheckedPeriod2] = useState(false);

  // Widget name
  const [widgetName, setWidgetName] = useState("");

  // Dates
  const year = new Date().getFullYear();
  const defaultStartDate = new Date(`${year}-01-01`);
  const defaultEndDate = new Date(`${year}-12-31`);
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);

  // Période
  const [selectedPeriod, setSelectedPeriod] = useState<OptionType | null>(
    periodsType[2]
  );

  // Indicateurs
  const [count, setCount] = useState(1); // By default count = 1
  const [indicators, setIndicators] = useState<Indicateur[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedIndicator, setSelectedIndicator] = useState<Indicateur | null>(
    null
  );
  const [hasNotClickedOnDelIndicatorBtn, setHasNotClickedOnDelIndicatorBtn] =
    useState(false);

  // Axes
  const [axes, setAxes] = useState<Axe[]>([]);
  const [removedIndicatoreIDS, setRemovedIndicatoreIDS] = useState<number[]>(
    []
  );

  // Filtre
  const [checkedNoFilteredPlot, setCheckedNoFilteredPlot] = useState(true);
  const [checkedFilteredPlot, setCheckedFilteredPlot] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<OptionType | null>(null);

  // Filtered axe data from DB "Fréquence et intensité (%)"
  const filtredAxeFreIntFromDB = axeData?.filter(
    axe => axe.nom === "Fréquence et intensité (%)"
  );

  // Format plot data as OptionType
  const plotOptions: OptionType[] = plotData
    ? plotData.map(plot => ({
        id: plot.id as number,
        label: plot.nom,
        value: plot.nom,
      }))
    : [];

  // Filtered & format the main indictor data
  const formatIndicatorData = indicateurs
    .map(indicateur => {
      // If indicatorData is available
      if (indicatorData && indicatorData.length > 0) {
        for (const indicatorDatum of indicatorData) {
          if (
            indicateur.nom &&
            indicatorDatum.nom &&
            indicateur.nom.toLowerCase() === indicatorDatum.nom.toLowerCase()
          ) {
            return {
              ...indicateur,
              id: indicatorDatum.id,
              id_indicator: indicatorDatum.id,
              id_axe: indicatorDatum.id_axe,
              axe_nom:
                filtredAxeFreIntFromDB &&
                filtredAxeFreIntFromDB.length > 0 &&
                indicateur.nom &&
                indicateur.provenance === "Rospot" &&
                indicateur.nom !== "Nombre de feuilles" &&
                indicateur.isPercentageAxe
                  ? filtredAxeFreIntFromDB[0].nom
                  : indicateur.nom,
            };
          }
        }

        return {
          ...indicateur,
        };
      } else {
        return {
          ...indicateur,
          id_indicator: indicateur.id_indicator,
          axe_nom:
            filtredAxeFreIntFromDB && filtredAxeFreIntFromDB.length > 0
              ? filtredAxeFreIntFromDB[0].nom
              : indicateur.nom,
        };
      }
    })
    .filter(f => f != undefined)
    .filter(f => f.provenance != "Weenat"); // Filter Weenat data out

  // Format indicator options
  const indicatorOptions: OptionTypeIndicator[] = formatIndicatorData.map(
    formatIndicatorDatum => ({
      id: formatIndicatorDatum.id_indicator as number | string,
      id_indicator: formatIndicatorDatum.id_indicator as string,
      label: formatIndicatorDatum.nom as string,
      value: formatIndicatorDatum.nom as string,
      id_axe: formatIndicatorDatum.id_axe,
      provenance: formatIndicatorDatum.provenance,
      isPercentageAxe: formatIndicatorDatum.isPercentageAxe,
      isNumberAxe: formatIndicatorDatum.isNumberAxe,
    })
  );

  // Actif axes (No duplicates)
  const actifAxes = Array.from(new Set(axes?.map(a => a.nom))).map(nom => {
    return axes?.find(a => a.nom === nom);
  });

  // Add indicator
  const handleAddIndicator = () => {
    if (actifAxes.length >= 2) {
      return toastError(
        "Un graphique ne peut pas avoir plus de deux axes",
        "error-inputs"
      );
    }

    setHasNotClickedOnDelIndicatorBtn(false);
    setCount(prev => prev + 1);

    if (count > 8) {
      setCount(9);
      return;
    }
  };

  // Remove indicator
  const handleRemoveIndicator = (
    index: number,
    indicatorOption: OptionTypeIndicator | null
  ) => {
    setHasNotClickedOnDelIndicatorBtn(true);
    setSelectedIndicator(null);

    // Update count
    setCount(prev => prev - 1);

    if (indicatorOption) {
      // Update removed indicators
      setRemovedIndicatoreIDS(prev => {
        const copiedRemovedIndicatoreIDS = [...prev];
        copiedRemovedIndicatoreIDS.push(+indicatorOption.id);
        return copiedRemovedIndicatoreIDS;
      });

      // Update indicators
      setIndicators(prev => {
        const copiedIndicators = [...prev];
        const filteredIndicators = copiedIndicators.filter(copiedIndicator => {
          return copiedIndicator.id_indicator !== indicatorOption.id_indicator;
        });
        return filteredIndicators;
      });

      // Update axes
      setAxes(prev => {
        const copiedAxes = [...prev];
        const filteredAxes = copiedAxes.filter(
          copiedAxe => copiedAxe.id_indicator !== indicatorOption.id_indicator
        );
        return filteredAxes;
      });
    } else {
      setIndicators(prev => {
        const copiedIndicators = [...prev];
        copiedIndicators.splice(index, 1);
        return copiedIndicators;
      });
    }
  };

  const handleChangeDate = ([newStartDate, newEndDate]: [
    Date | null,
    Date | null
  ]) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingOnSubmit(true);
    setInputErrors(null);
    const error: { [key: string]: string } = {};

    // Validations
    // Titre
    if (!widgetName) {
      error.widgetName = "Veuillez donner un titre à ce graphique";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        widgetName: error.widgetName,
      }));
    }
    if (widgetName && widgetName.length > 100) {
      error.widgetName = "Le titre ne peut pas dépasser 100 caractères";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        widgetName: error.widgetName,
      }));
    }

    // Période
    if (
      (checkedPeriod1 && !checkedPeriod2 && !startDate) ||
      (checkedPeriod1 && !checkedPeriod2 && !endDate)
    ) {
      error.dateRange = "Veuillez sélectionner une période valide";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        dateRange: error.dateRange,
      }));
    }

    // Indicateurs
    if (
      indicators.length === 0 ||
      (indicators.length > 0 && indicators.some(indicator => !indicator.nom))
    ) {
      error.indicator = "Veuillez sélectionner au moins un indicateur";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        indicator: error.indicator,
      }));
    }

    // Axes
    if (axes.length > 0) {
      const hasAxeWithoutMin = axes.find(
        axe => axe.min === null || axe.min.toString() === ""
      );

      const hasAxeWithoutMax = axes.find(
        axe => axe.max === null || axe.max.toString() === ""
      );

      if (hasAxeWithoutMin) {
        error.axeMinMax = "Veuillez renseigner une valeur minimum";

        setLoadingOnSubmit(false);
        return setInputErrors(o => ({
          ...o,
          [`axeMinMax-${hasAxeWithoutMin.id}`]: error.axeMinMax,
        }));
      }

      if (hasAxeWithoutMax) {
        error.axeMinMax = "Veuillez renseigner une valeur maximum";

        setLoadingOnSubmit(false);
        return setInputErrors(o => ({
          ...o,
          [`axeMinMax-${hasAxeWithoutMax.id}`]: error.axeMinMax,
        }));
      }
    }

    // Filtre
    if (!checkedNoFilteredPlot && checkedFilteredPlot && !selectedPlot) {
      error.plot = "Veuillez sélectionner une parcelle";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        plot: error.plot,
      }));
    }

    try {
      // EXPLOITATION NE POSSEDE PAS DE DASHBOARD
      if (
        explID &&
        explName &&
        dashboardID === "null" &&
        hadDashboard === "false"
      ) {
        console.log("NE POSSEDE PAS DE DASHBOARD");

        const newDashboard: Dashboard = {
          nom: `dashboard-${explID}-${stripSpaceLowerSTR(explName)}`,
          id_exploitation: Number(explID),
        };

        // 1st: create dashboard data to DB
        const addedDashboard = await addDashboard(newDashboard);

        if (!addedDashboard.success) {
          setLoadingOnSubmit(false);
          return toastError(
            "Une erreur est survenue pendant la création du Dashboard",
            "create-dashboard-failed"
          );
        }

        // Widget graphique object
        const graphiqueWidget: Widget = {
          id_dashboard: addedDashboard.addedDashboard?.id as number,
          type: WidgetTypeEnum.GRAPHIQUE,
          params: {
            nom: widgetName,
            index: 0,
            hauteur: WidgetHauteurEnum.S,
            date_auto:
              !checkedPeriod1 &&
              checkedPeriod2 &&
              selectedPeriod &&
              selectedPeriod.value
                ? true
                : false,
            mode_date_auto:
              !checkedPeriod1 && checkedPeriod2 && selectedPeriod
                ? selectedPeriod.value
                : "",
            indicateurs: [],
            axes: [],
            id_plot:
              checkedFilteredPlot && selectedPlot?.id ? +selectedPlot.id : null,
          },
        };

        // Indicateurs & Axes
        if (axes && axes.length > 0 && indicators && indicators.length > 0) {
          const addedAxes = new Map(); // Stocker les axes avec leur ID
          const addedIndicators = new Set(); // Indicators Set

          // AXES
          // For loop of axes
          for (const axe of axes) {
            if (addedAxes.has(axe.nom)) {
              continue;
            }

            // Construct axe object for DB
            const newAxe: Axe = {
              nom: axe.nom,
              min: axe.nom === "Nombre de feuilles" ? 0 : AxeMinMaxEnum.MIN,
              max: axe.nom === "Nombre de feuilles" ? 999 : AxeMinMaxEnum.MAX,
              unite: axe.unite,
            };

            // 1st: create new "Axe" to DB or give the exists axe from DB
            const addedAxeDB =
              axe.id !== null && typeof axe.id === "number"
                ? {
                    addedAxe: axe,
                    success: true,
                  }
                : await addAxe(newAxe);

            if ((addedAxeDB && !addedAxeDB.success) || !addedAxeDB.addedAxe) {
              setLoadingOnSubmit(false);
              return toastError(
                "Une erreur est survenue pendant la création de l'axe",
                "create-axe-failed"
              );
            }

            // Associer l'axe à son ID
            addedAxes.set(axe.nom, addedAxeDB.addedAxe.id);

            // INDICATORS
            // Update params indicateurs
            graphiqueWidget.params.indicateurs =
              graphiqueWidget.params.indicateurs
                ?.filter(
                  indParam => !removedIndicatoreIDS.includes(indParam.id)
                )
                .map(indParam => {
                  // Update min_max
                  if (indParam.id === axe.id_indicator) {
                    return {
                      ...indParam,
                      min_max: [Number(axe.min), Number(axe.max)],
                    };
                  } else if (axe.nom === "Fréquence et intensité (%)") {
                    return {
                      ...indParam,
                      min_max: [Number(axe.min), Number(axe.max)],
                    };
                  } else {
                    return indParam;
                  }
                });

            // Associer les indicateurs à cet axe
            const filteredIndicators = indicators.filter(
              indicator =>
                indicator.axe_nom?.toLowerCase() === axe.nom?.toLowerCase()
            );

            // For loop of indicators
            for (const indicator of filteredIndicators) {
              if (addedIndicators.has(indicator.nom)) {
                continue;
              }

              // Construct indicator object for DB
              const newIndicator: Indicateur = {
                nom: indicator.nom,
                params: {
                  source: "SRC",
                },
                data_field: null,
                type_viz: null,
                id_axe: addedAxeDB.addedAxe.id as number,
              };

              // 2nd: create indicator data to DB if there no indicator
              const addedIndicatorDB =
                indicator.id_indicator &&
                typeof indicator.id_indicator === "number"
                  ? {
                      addedIndicator: {
                        ...indicator,
                        id: indicator.id_indicator,
                      },
                      success: true,
                    }
                  : await addIndicator(newIndicator);

              if (
                (addedIndicatorDB && !addedIndicatorDB.success) ||
                !addedIndicatorDB.addedIndicator
              ) {
                setLoadingOnSubmit(false);
                return toastError(
                  "Une erreur est survenue pendant la création de l'indicateur",
                  "create-indicator-failed"
                );
              }

              // Add indicator to set
              addedIndicators.add(indicator.nom);

              // Get all indicators IDs
              const addedIndicatorIDS = indicators.map(ind => ind.id);

              // Add axe to params axes
              graphiqueWidget.params.axes?.push({
                nom_axe: axe.nom as string,
                id_indicator: axe.id_indicator as number,
                automatic: axe.automatic ? axe.automatic : false,
              });

              // Remove duplicates by nom
              graphiqueWidget.params.axes = removeDuplicatesAxe(
                graphiqueWidget.params.axes as {
                  nom_axe: string;
                  id_indicator: number;
                  automatic: boolean;
                }[]
              );

              // Update params indicateurs
              if (
                graphiqueWidget.params.indicateurs &&
                graphiqueWidget.params.indicateurs.length >= 0 &&
                !addedIndicatorIDS.includes(addedIndicatorDB.addedIndicator.id)
              ) {
                // Push indicator to graphiqueWidget params
                graphiqueWidget.params.indicateurs?.push({
                  couleur: indicator.color as string,
                  id: addedIndicatorDB.addedIndicator.id as number, // ID indicator in DB
                  min_max: [Number(axe.min), Number(axe.max)],
                });
              }
            }
          }
        }

        // Si !date_auto, on passe à la date manuelle
        if (
          graphiqueWidget.params?.date_auto == false &&
          graphiqueWidget.params.mode_date_auto === ""
        ) {
          graphiqueWidget.params.date_debut_manuelle = startDate;
          graphiqueWidget.params.date_fin_manuelle = endDate;
        }

        // 4th: create graphique data to DB
        const responseAddedGraphique = await addWidget(graphiqueWidget);
        setLoadingOnSubmit(false);

        if (
          responseAddedGraphique.success &&
          responseAddedGraphique.addedGraphique
        ) {
          // Update exploitation context
          const foundExpl = exploitations?.find(expl => expl.id === +explID);
          if (foundExpl) {
            handleSelectedExploitationOption({
              dashboard: addedDashboard.addedDashboard as Dashboard,
              had_dashboard: true,
              id: foundExpl.id,
              label: foundExpl.label,
              value: foundExpl.value,
            });
          }

          toastSuccess(`Graphique ${widgetName} crée`, "create-widget-success");
          const addGraphPathUrl = `${
            MenuUrlPath.ANALYSES
          }/?explID=${explID}&explName=${explName}&dashboardID=${
            graphiqueWidget.id_dashboard
          }&hadDashboard=${true}`;
          router.push(addGraphPathUrl);
        }
      }

      // EXPLOITATION POSSEDE DEJA UN DASHBOARD
      if (
        explID &&
        explName &&
        dashboardID &&
        dashboardID !== "null" &&
        hadDashboard === "true"
      ) {
        console.log("POSSEDE DEJA UN DASHBOARD");

        // Widget graphique object
        const graphiqueWidget: Widget = {
          id_dashboard: +dashboardID,
          type: WidgetTypeEnum.GRAPHIQUE,
          params: {
            nom: widgetName,
            index: 0,
            hauteur: WidgetHauteurEnum.S,
            date_auto:
              !checkedPeriod1 &&
              checkedPeriod2 &&
              selectedPeriod &&
              selectedPeriod.value
                ? true
                : false,
            mode_date_auto:
              !checkedPeriod1 && checkedPeriod2 && selectedPeriod
                ? selectedPeriod.value
                : "",
            indicateurs: [],
            axes: [],
            id_plot:
              checkedFilteredPlot && selectedPlot?.id ? +selectedPlot.id : null,
          },
        };

        // Indicateurs & Axes
        if (axes && axes.length > 0 && indicators && indicators.length > 0) {
          const addedAxes = new Map(); // Stocker les axes avec leur ID
          const addedIndicators = new Set(); // Indicators Set

          // AXES
          // For loop of axes
          for (const axe of axes) {
            if (addedAxes.has(axe.nom)) {
              continue;
            }

            // Construct axe object for DB
            const newAxe: Axe = {
              nom: axe.nom,
              min: axe.nom === "Nombre de feuilles" ? 0 : AxeMinMaxEnum.MIN,
              max: axe.nom === "Nombre de feuilles" ? 999 : AxeMinMaxEnum.MAX,
              unite: axe.unite,
            };

            // 1st: create new "Axe" to DB or give the exists axe from DB
            const addedAxeDB =
              axe.id !== null && typeof axe.id === "number"
                ? {
                    addedAxe: axe,
                    success: true,
                  }
                : await addAxe(newAxe);

            if ((addedAxeDB && !addedAxeDB.success) || !addedAxeDB.addedAxe) {
              setLoadingOnSubmit(false);
              return toastError(
                "Une erreur est survenue pendant la création de l'axe",
                "create-axe-failed"
              );
            }

            // Associer l'axe à son ID
            addedAxes.set(axe.nom, addedAxeDB.addedAxe.id);

            // INDICATORS
            // Update params indicateurs
            graphiqueWidget.params.indicateurs =
              graphiqueWidget.params.indicateurs
                ?.filter(
                  indParam => !removedIndicatoreIDS.includes(indParam.id)
                )
                .map(indParam => {
                  // Update min_max
                  if (indParam.id === axe.id_indicator) {
                    return {
                      ...indParam,
                      min_max: [Number(axe.min), Number(axe.max)],
                    };
                  } else if (axe.nom === "Fréquence et intensité (%)") {
                    return {
                      ...indParam,
                      min_max: [Number(axe.min), Number(axe.max)],
                    };
                  } else {
                    return indParam;
                  }
                });

            // Associer les indicateurs à cet axe
            const filteredIndicators = indicators.filter(
              indicator =>
                indicator.axe_nom?.toLowerCase() === axe.nom?.toLowerCase()
            );

            // For loop of indicators
            for (const indicator of filteredIndicators) {
              if (addedIndicators.has(indicator.nom)) {
                continue;
              }

              // Construct indicator object for DB
              const newIndicator: Indicateur = {
                nom: indicator.nom,
                params: {
                  source: "SRC",
                },
                data_field: null,
                type_viz: null,
                id_axe: addedAxeDB.addedAxe.id as number,
              };

              // 2nd: create indicator data to DB if there no indicator
              const addedIndicatorDB =
                indicator.id_indicator &&
                typeof indicator.id_indicator === "number"
                  ? {
                      addedIndicator: {
                        ...indicator,
                        id: indicator.id_indicator,
                      },
                      success: true,
                    }
                  : await addIndicator(newIndicator);

              if (
                (addedIndicatorDB && !addedIndicatorDB.success) ||
                !addedIndicatorDB.addedIndicator
              ) {
                setLoadingOnSubmit(false);
                return toastError(
                  "Une erreur est survenue pendant la création de l'indicateur",
                  "create-indicator-failed"
                );
              }

              // Add indicator to set
              addedIndicators.add(indicator.nom);

              // Get all indicators IDs
              const addedIndicatorIDS = indicators.map(ind => ind.id);

              // Update params indicateurs
              graphiqueWidget.params.axes?.push({
                nom_axe: axe.nom as string,
                id_indicator: axe.id_indicator as number,
                automatic: axe.automatic ? axe.automatic : false,
              });

              // Remove duplicates by nom
              graphiqueWidget.params.axes = removeDuplicatesAxe(
                graphiqueWidget.params.axes as {
                  nom_axe: string;
                  id_indicator: number;
                  automatic: boolean;
                }[]
              );

              // Update params indicateurs
              if (
                graphiqueWidget.params.indicateurs &&
                graphiqueWidget.params.indicateurs.length >= 0 &&
                !addedIndicatorIDS.includes(addedIndicatorDB.addedIndicator.id)
              ) {
                // Push indicator to graphiqueWidget params
                graphiqueWidget.params.indicateurs?.push({
                  couleur: indicator.color as string,
                  id: addedIndicatorDB.addedIndicator.id as number, // ID indicator in DB
                  min_max: [Number(axe.min), Number(axe.max)],
                });
              }
            }
          }
        }

        // Si !date_auto, on passe à la date manuelle
        if (
          graphiqueWidget.params?.date_auto == false &&
          graphiqueWidget.params.mode_date_auto === ""
        ) {
          graphiqueWidget.params.date_debut_manuelle = startDate;
          graphiqueWidget.params.date_fin_manuelle = endDate;
        }

        // 3rd: Create graphique data to DB
        const responseAddedGraphique = await addWidget(graphiqueWidget);
        setLoadingOnSubmit(false);

        if (
          responseAddedGraphique.success &&
          responseAddedGraphique.addedGraphique
        ) {
          toastSuccess(`Graphique ${widgetName} crée`, "create-widget-success");
          router.push(pathUrl);
        }
      }
    } catch (error) {
      console.log("Error :", error);

      toastError(
        `Serveur erreur, veuillez réessayez plus tard!`,
        "create-widget-failed"
      );
    }
  };

  useEffect(() => {
    if (hasNotClickedOnDelIndicatorBtn && indicators.length === 0) {
      setAxes([]);
      setSelectedIndicator(null);
      setHasNotClickedOnDelIndicatorBtn(false);
    }
  }, [indicators, hasNotClickedOnDelIndicatorBtn]);

  // Max 8 indicators
  useEffect(() => {
    if (count > 8) {
      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        indicator: "Un graphique ne peut pas avoir plus de 8 indicateurs",
      }));
    } else {
      setLoadingOnSubmit(false);
      setInputErrors(null);
    }
  }, [count]);

  // Errors display generic
  useEffect(() => {
    if (inputErrors) {
      toastError(
        "Veuillez revoir les champs indiqués pour continuer",
        "error-inputs"
      );
    }
  }, [inputErrors]);

  const emptyData = widgetName.length === 0;

  console.log("indicators :", indicators);
  console.log("axes :", axes);
  console.log("actifAxes :", actifAxes);

  return (
    <>
      <PageWrapper
        pageTitle="Rospot | Créer un graphique"
        navBarTitle="Créer un graphique"
        back={true}
        emptyData={emptyData}
        pathUrl={pathUrl}
      >
        {/* Content */}
        <div className="container mx-auto">
          {/* Loading */}
          {loading && <Loading />}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {/* Titre */}
              <div className="flex flex-col gap-1">
                <p className="font-bold">
                  Titre <span className="text-error">*</span>
                </p>
                <label className="input input-primary focus-within:border-2 border-txton2 flex items-center gap-2 bg-white rounded-md h-10 p-2">
                  <input
                    type="text"
                    className="grow"
                    value={widgetName}
                    onChange={e => setWidgetName(e.target.value)}
                  />
                </label>

                {/* Error */}
                <ErrorInputForm
                  inputErrors={inputErrors}
                  property="widgetName"
                />
              </div>

              {/* Période */}
              <div className="flex flex-col gap-1">
                <p className="font-bold">
                  Période <span className="text-error">*</span>
                </p>

                <div className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    className="mr-2 radio radio-sm checked:bg-primary"
                    checked={checkedPeriod1}
                    onChange={() => {
                      setCheckedPeriod2(false);
                      setCheckedPeriod1(true);
                    }}
                  />

                  <div
                    className="w-full relative"
                    onClick={() => {
                      setCheckedPeriod2(false);
                      setCheckedPeriod1(true);
                    }}
                  >
                    <DatePicker
                      locale="fr"
                      startDate={startDate}
                      endDate={endDate}
                      onChange={handleChangeDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="JJ/MM/AAAA - JJ/MM/AAAA"
                      selectsRange
                      strictParsing
                      className="custom-react-datepicker"
                    />
                    {/* Date icon */}
                    <div className="flex gap-3 items-center absolute -bottom-1 right-2">
                      <span className="divider"></span>
                      <DateIcon />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="period"
                    type="radio"
                    name="period"
                    className="mr-2 radio radio-sm checked:bg-primary"
                    checked={checkedPeriod2}
                    onChange={() => {
                      setCheckedPeriod1(false);
                      setCheckedPeriod2(true);
                    }}
                  />

                  <div
                    className="w-full"
                    id="period"
                    onClick={() => {
                      setCheckedPeriod1(false);
                      setCheckedPeriod2(true);
                    }}
                  >
                    <SingleSelect
                      data={periodsType}
                      selectedOption={selectedPeriod}
                      isClearable={isClearable}
                      setSelectedOption={
                        setSelectedPeriod as Dispatch<
                          SetStateAction<
                            | OptionType
                            | OptionTypeDashboard
                            | OptionTypeIndicator
                            | null
                          >
                        >
                      }
                      setIsClearable={setIsClearable}
                    />
                  </div>
                </div>

                {/* Error */}
                <ErrorInputForm
                  inputErrors={inputErrors}
                  property="dateRange"
                />
              </div>

              {/* Indicateurs */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-3 items-center">
                  <p className="font-bold">Indicateurs</p>
                  <button type="button" onClick={handleAddIndicator}>
                    <AddPlusBigIcon />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-3 mb-1">
                  {/* Color Picker 1 */}
                  {Array.from({ length: count }).map((_, index) => {
                    const color = (
                      DataVisualization as { [key: string]: string }
                    )[`COLOR_${index}`];

                    return (
                      <div className="w-full" key={index}>
                        <ColorPickerSelectIndicator
                          index={index}
                          count={count}
                          setAxes={setAxes}
                          setCount={setCount}
                          indicatorColor={color}
                          indicators={indicators}
                          actifAxes={actifAxes}
                          setIndicators={setIndicators}
                          setRemovedIndicatoreIDS={setRemovedIndicatoreIDS}
                          indicatorOptions={indicatorOptions}
                          handleRemoveIndicator={handleRemoveIndicator}
                          setSelectedIndicator={setSelectedIndicator}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Error */}
                <ErrorInputForm
                  inputErrors={inputErrors}
                  property="indicator"
                />
              </div>

              {/* Axes */}
              {indicators.length > 0 && (
                <div className="flex flex-col gap-4">
                  {axes.length > 0 &&
                    axes
                      .filter(
                        (axe, index, self) =>
                          index === self.findIndex(a => a.nom === axe.nom)
                      )
                      .map((axe, index) => {
                        return (
                          <AxeWidgetAutomaticManual
                            key={index}
                            axe={axe}
                            index={index}
                            startDate={startDate}
                            endDate={endDate}
                            selectedPeriod={selectedPeriod}
                            checkedPeriod2={checkedPeriod2}
                            selectedPlot={selectedPlot}
                            inputErrors={inputErrors}
                            setAxes={setAxes}
                          />
                        );
                      })}
                </div>
              )}

              {/* Filtre */}
              <div className="flex flex-col gap-1">
                <p className="font-bold">
                  Filtrer les observations par parcelle
                </p>

                <div
                  className="flex items-center"
                  onClick={() => {
                    setCheckedNoFilteredPlot(true);
                    setCheckedFilteredPlot(false);
                  }}
                >
                  <input
                    id="filtre"
                    type="radio"
                    name="filtre"
                    className="mr-2 radio radio-sm checked:bg-primary"
                    checked={checkedNoFilteredPlot}
                    onChange={() => {
                      setCheckedNoFilteredPlot(true);
                      setCheckedFilteredPlot(false);
                    }}
                  />
                  <span>Non</span>
                </div>

                <div className="flex items-center">
                  <input
                    id="filtre"
                    type="radio"
                    name="filtre"
                    className="mr-2 radio radio-sm checked:bg-primary"
                    checked={checkedFilteredPlot}
                    onChange={() => {
                      setCheckedNoFilteredPlot(false);
                      setCheckedFilteredPlot(true);
                    }}
                  />

                  <div
                    className="w-full"
                    id="filtre"
                    onClick={() => {
                      setCheckedNoFilteredPlot(false);
                      setCheckedFilteredPlot(true);
                    }}
                  >
                    <SingleSelect
                      data={plotOptions}
                      selectedOption={checkedFilteredPlot ? selectedPlot : null}
                      isClearable={isClearable}
                      setSelectedOption={
                        setSelectedPlot as Dispatch<
                          SetStateAction<
                            | OptionType
                            | OptionTypeDashboard
                            | OptionTypeIndicator
                            | null
                          >
                        >
                      }
                      setIsClearable={setIsClearable}
                    />
                  </div>
                </div>

                {/* Error */}
                <ErrorInputForm inputErrors={inputErrors} property="plot" />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className={`btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md`}
              >
                {loadingOnSubmit ? (
                  <span className="loading loading-spinner text-txton3"></span>
                ) : (
                  "Valider"
                )}
              </button>
            </div>
          </form>
        </div>
      </PageWrapper>
    </>
  );
};

export default AddWidgetClient;
