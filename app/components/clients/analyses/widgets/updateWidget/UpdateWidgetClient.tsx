"use client";

import {
  Dispatch,
  FormEvent,
  useEffect,
  useState,
  SetStateAction,
} from "react";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import SingleSelect from "@/app/components/selects/SingleSelect";
import { axeMockedData, indicateurs, periodsType } from "@/app/mockedData";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import { OptionType } from "@/app/models/types/OptionType";
import { useRouter } from "next/navigation";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import updateWidget from "@/app/actions/widgets/updateWidget";
import { Widget, WidgetTypeEnum } from "@/app/models/interfaces/Widget";
import StickyMenuBarWrapper from "@/app/components/shared/wrappers/StickyMenuBarWrapper";
import SearchOptionsAnalyses from "@/app/components/searchs/SearchOptionsAnalyses";
import ModalDeleteConfirm from "@/app/components/modals/ModalDeleteConfirm";
import deleteWidget from "@/app/actions/widgets/deleteWidget";
import useGetWidget from "@/app/hooks/widgets/useGetWidget";
import Loading from "@/app/components/shared/loaders/Loading";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import useCustomWidgetSearchParams from "@/app/hooks/useCustomWidgetSearchParams";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import AxeWidgetAutomaticManual from "@/app/components/forms/analyses/widgets/AxeWidgetAutomaticManual";
import ColorPickerSelectIndicator from "@/app/components/forms/analyses/widgets/ColorPickerSelectIndicator";
import AddPlusBigIcon from "@/app/components/shared/icons/AddPlusBigIcon";
import { DataVisualization } from "@/app/models/enums/DataVisualization";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import { Axe } from "@/app/models/interfaces/Axe";
import useGetIndicators from "@/app/hooks/indicators/useGetIndicators";
import useGetAxes from "@/app/hooks/axes/useGetAxes";
import { AxeMinMaxEnum } from "@/app/models/enums/AxeEnum";
import addAxe from "@/app/actions/axes/addAxe";
import addIndicator from "@/app/actions/indicateurs/addIndicator";
import useGetPlots from "@/app/hooks/plots/useGetPlots";
import removeDuplicatesAxe from "@/app/helpers/removeDuplicatesAxe";
registerLocale("fr", fr);

const UpdateWidgetClient = () => {
  const router = useRouter();
  const { widgetID } = useCustomWidgetSearchParams();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { loading, widget } = useGetWidget(widgetID);
  const { plots: plotData } = useGetPlots(explID);
  const { indicators: indicatorData } = useGetIndicators();
  const { axes: axeData } = useGetAxes();

  const explQueries = `explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;
  const pathUrl = `${MenuUrlPath.ANALYSES}?${explQueries}`;

  // States
  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [inputErrors, setInputErrors] = useState<{
    [key: string]: string;
  } | null>(null);
  const [isClearable, setIsClearable] = useState(false);
  const [confirmDeleteWidget, setConfirmDeleteWidget] = useState(false);

  // Widget name
  const [widgetName, setWidgetName] = useState(widget?.params.nom ?? "");

  // Dates
  const year = new Date().getFullYear();
  const defaultStartDate = new Date(
    widget?.params.date_debut_manuelle ?? `${year}-01-01`
  );
  const defaultEndDate = new Date(
    widget?.params.date_fin_manuelle ?? `${year}-12-31`
  );
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);

  const [selectedPeriod, setSelectedPeriod] = useState<
    OptionType | OptionTypeDashboard | OptionTypeIndicator | null
  >(
    widget && widget.params && widget.params.mode_date_auto
      ? (periodsType.find(
          (p) => p.value === widget.params.mode_date_auto
        ) as OptionType)
      : periodsType[2]
  );

  const [checkedPeriod1, setCheckedPeriod1] = useState(
    widget && widget.params && !widget.params.date_auto ? true : false
  );
  const [checkedPeriod2, setCheckedPeriod2] = useState(
    widget && widget.params && widget.params.date_auto ? true : false
  );

  // Indicateurs
  const [count, setCount] = useState(1);
  const [indicators, setIndicators] = useState<Indicateur[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedIndicator, setSelectedIndicator] = useState<Indicateur | null>(
    null
  );
  const [hasClickedOnDelIndicatorBtn, setHasClickedOnDelIndicatorBtn] =
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
    (axe) => axe.nom === "Fréquence et intensité (%)"
  );

  // Format plot data as OptionType
  const plotOptions: OptionType[] = plotData
    ? plotData.map((plot) => ({
        id: plot.id as number,
        label: plot.nom,
        value: plot.nom,
      }))
    : [];

  // Filtered & format the main indictor data
  const formatIndicatorData = indicateurs
    .map((indicateur) => {
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
    .filter((f) => f != undefined)
    .filter((f) => f.provenance != "Weenat"); // Filter Weenat data out

  // Format indicator options
  const indicatorOptions: OptionTypeIndicator[] = formatIndicatorData.map(
    (formatIndicatorDatum) => ({
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

  // Format axe data
  const formatAxeData = axeMockedData.map((axeMockedDatum) => {
    if (axeData && axeData.length > 0) {
      for (const axeDatum of axeData) {
        if (axeDatum.nom === axeMockedDatum.nom) {
          const founIndicator = formatIndicatorData.find(
            (formatIndicatorDatum) =>
              axeMockedDatum.indicator_nom === formatIndicatorDatum.nom
          );

          return {
            ...axeMockedDatum,
            id: axeDatum.id,
            id_mocked_axe: axeDatum.id,
            min: axeDatum.min,
            max: axeDatum.max,
            unite: axeDatum.unite,
            id_indicator: founIndicator ? founIndicator.id : null,
          };
        }
      }
    }

    return axeMockedDatum;
  });

  // Actif axes  (No duplicates)
  const actifAxes = Array.from(new Set(axes?.map((a) => a.nom))).map((nom) => {
    return axes?.find((a) => a.nom === nom);
  });

  // Add indicator
  const handleAddIndicator = () => {
    if (actifAxes.length >= 2) {
      return toastError(
        "Un graphique ne peut pas avoir plus de deux axes",
        "error-inputs"
      );
    }

    setCount((prev) => prev + 1);

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
    setHasClickedOnDelIndicatorBtn(true);
    setSelectedIndicator(null);

    // Update count
    setCount((prev) => prev - 1);

    if (indicatorOption) {
      // Update removed indicators
      setRemovedIndicatoreIDS((prev) => {
        const copiedRemovedIndicatoreIDS = [...prev];
        copiedRemovedIndicatoreIDS.push(+indicatorOption.id);
        return copiedRemovedIndicatoreIDS;
      });

      // Update indicators
      setIndicators((prev) => {
        const copiedIndicators = [...prev];
        const filteredIndicators = copiedIndicators.filter(
          (copiedIndicator) => {
            return (
              copiedIndicator.id_indicator !== indicatorOption.id_indicator
            );
          }
        );
        return filteredIndicators;
      });

      // Update axes
      setAxes((prevs) => {
        const copiedAxes = [...prevs];
        const filteredAxes = copiedAxes.filter(
          (copiedAxe) =>
            copiedAxe?.id_indicator !== indicatorOption.id_indicator
        );
        return filteredAxes as Axe[];
      });
    } else {
      setIndicators((prev) => {
        const copiedIndicators = [...prev];
        copiedIndicators.splice(index, 1);
        return copiedIndicators;
      });
    }
  };

  // Delete widget
  const handleDeleteWidget = async (widgetID?: number) => {
    if (widgetID) {
      const response = await deleteWidget(+widgetID);

      if (response && response.success && response.deletedWidget) {
        toastSuccess(`Graphique supprimé`, "delete-widget-success");
        router.push(pathUrl);
      } else {
        toastError(
          `Serveur erreur,veuillez réessayez plus tard!`,
          "delete-widget-failed"
        );
      }
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
      return setInputErrors((o) => ({
        ...o,
        widgetName: error.widgetName,
      }));
    }
    if (widgetName && widgetName.length > 100) {
      error.widgetName = "Le titre ne peut pas dépasser 100 caractères";

      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
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
      return setInputErrors((o) => ({
        ...o,
        dateRange: error.dateRange,
      }));
    }

    // Indicateurs
    if (
      indicators.length === 0 ||
      (indicators.length > 0 && indicators.some((indicator) => !indicator.nom))
    ) {
      error.indicator = "Veuillez choisir un indicateur dans la liste";

      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        indicator: error.indicator,
      }));
    }

    // Axes
    if (axes.length > 0) {
      const hasAxeWithoutMin = axes.find(
        (axe) => axe.min === null || axe.min.toString() === ""
      );

      const hasAxeWithoutMax = axes.find(
        (axe) => axe.max === null || axe.max.toString() === ""
      );

      if (hasAxeWithoutMin) {
        error.axeMinMax = "Veuillez renseigner une valeur minimum";

        setLoadingOnSubmit(false);
        return setInputErrors((o) => ({
          ...o,
          [`axeMinMax-${hasAxeWithoutMin.id}`]: error.axeMinMax,
        }));
      }

      if (hasAxeWithoutMax) {
        error.axeMinMax = "Veuillez renseigner une valeur maximum";

        setLoadingOnSubmit(false);
        return setInputErrors((o) => ({
          ...o,
          [`axeMinMax-${hasAxeWithoutMax.id}`]: error.axeMinMax,
        }));
      }
    }

    // Filtre
    if (!checkedNoFilteredPlot && checkedFilteredPlot && !selectedPlot) {
      error.plot = "Veuillez sélectionner une parcelle";

      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        plot: error.plot,
      }));
    }

    try {
      if (widget) {
        console.log("POSSEDE DEJA UN DASHBOARD");

        const graphiqueWidget: Widget = {
          ...widget,
          type: WidgetTypeEnum.GRAPHIQUE,
          params: {
            ...widget.params,
            nom: widgetName,
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
            id_plot:
              checkedFilteredPlot && selectedPlot?.id ? +selectedPlot.id : null,
            axes: [],
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
                  (indParam) => !removedIndicatoreIDS.includes(indParam.id)
                )
                .map((indParam) => {
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
              (indicator) =>
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

              // Get all indicators ID
              const addedIndicatorIDS = indicators.map((ind) => ind.id);

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

              // Add indicator to params indicateurs
              if (
                widget.params.indicateurs &&
                widget.params.indicateurs.length > 0 &&
                !addedIndicatorIDS.includes(addedIndicatorDB.addedIndicator.id)
              ) {
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

        // Si date_auto, on supprime la date manuelle
        if (
          graphiqueWidget.params?.date_auto == true &&
          graphiqueWidget.params.mode_date_auto !== ""
        ) {
          delete graphiqueWidget.params.date_debut_manuelle;
          delete graphiqueWidget.params.date_fin_manuelle;
        }

        // Update graphique data from DB
        const updatedGraphique = await updateWidget(graphiqueWidget);
        setLoadingOnSubmit(false);

        if (updatedGraphique.success && updatedGraphique.updatedGraphique) {
          toastSuccess(`Graphique modifié`, "update-widget-success");
          router.push(pathUrl);
        }
      }
    } catch (error) {
      console.log("Error :", error);

      toastError(
        `Serveur erreur, veuillez réessayez plus tard!`,
        "update-widget-failed"
      );
    }
  };

  // Max 8 indicators
  useEffect(() => {
    if (count > 8) {
      setLoadingOnSubmit(false);
      return setInputErrors((o) => ({
        ...o,
        indicator: "Un graphique ne peut pas avoir plus de 8 indicateurs",
      }));
    } else {
      setLoadingOnSubmit(false);
      setInputErrors(null);
    }
  }, [count]);

  // Errors display
  useEffect(() => {
    if (inputErrors) {
      toastError(
        "Veuillez revoir les champs indiqués pour continuer",
        "error-inputs"
      );
    }
  }, [inputErrors]);

  useEffect(() => {
    setLoadingOnSubmit(false);

    if (confirmDeleteWidget) {
      const delete_confirm_modal = document.getElementById(
        "delete_confirm_modal"
      ) as HTMLDialogElement;

      if (delete_confirm_modal) {
        delete_confirm_modal.showModal();
      }
    }
  }, [confirmDeleteWidget]);

  // Update state when widget data is available
  useEffect(() => {
    if (widget && !hasClickedOnDelIndicatorBtn) {
      setCount(widget.params.indicateurs?.length ?? 1);
      setWidgetName(widget.params.nom ?? "");
      setStartDate(
        new Date(widget.params.date_debut_manuelle ?? `${year}-01-01`)
      );
      setEndDate(new Date(widget.params.date_fin_manuelle ?? `${year}-12-31`));
      setSelectedPeriod(
        widget.params.mode_date_auto
          ? (periodsType.find(
              (p) => p.value === widget.params.mode_date_auto
            ) as OptionType)
          : periodsType[2]
      );
      setCheckedPeriod1(!widget.params.date_auto);
      setCheckedPeriod2(!!widget.params.date_auto);

      // Update indicators
      setIndicators((prevs) => {
        const copiedIndicators = [...prevs];
        const filteredIndicators = formatIndicatorData
          ?.filter((formatIndicatorDatum) =>
            widget.params.indicateurs?.find(
              (indicatorInWidgetParams) =>
                indicatorInWidgetParams.id === formatIndicatorDatum.id_indicator
            )
          )
          .map((formatIndicatorDatum) => {
            return {
              ...formatIndicatorDatum,
              color: widget.params.indicateurs?.find(
                (indicatorInWidgetParams) =>
                  indicatorInWidgetParams.id ===
                  formatIndicatorDatum.id_indicator
              )?.couleur,
            } as Indicateur;
          });

        if (filteredIndicators) {
          return filteredIndicators as Indicateur[];
        }

        return copiedIndicators;
      });

      // Update axes
      setAxes((prevs) => {
        const copiedAxes = [...prevs];
        const filteredAxes = formatAxeData?.filter((formatAxeDatum) =>
          indicators?.find(
            (indicator) =>
              indicator.id_axe === formatAxeDatum.id &&
              indicator.id_indicator === formatAxeDatum.id_indicator &&
              indicator.nom === formatAxeDatum.indicator_nom
          )
        ) as Axe[];
        if (filteredAxes) {
          return filteredAxes;
        }
        return copiedAxes;
      });

      const foundPlot = plotData?.find(
        (plot) => plot.id === widget.params.id_plot
      );

      // Update filtred plot
      if (foundPlot) {
        setCheckedFilteredPlot(true);
        setCheckedNoFilteredPlot(false);

        setSelectedPlot({
          id: foundPlot?.id as number,
          label: foundPlot?.nom as string,
          value: foundPlot?.nom as string,
        });
      } else {
        setCheckedNoFilteredPlot(true);
        setCheckedFilteredPlot(false);
        setSelectedPlot(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, widget, axeData, indicatorData, hasClickedOnDelIndicatorBtn]);

  useEffect(() => {
    if (indicators.length === 0) {
      setAxes([]);
      setSelectedIndicator(null);
    }
  }, [indicators, hasClickedOnDelIndicatorBtn]);

  const emptData = widget?.params.nom === widgetName;

  return (
    <PageWrapper
      pageTitle="Rosa | Éditer le graphique"
      navBarTitle="Éditer le graphique"
      back={true}
      emptyData={emptData}
      pathUrl={pathUrl}
    >
      <>
        <StickyMenuBarWrapper>
          {/* Search options top bar */}
          <SearchOptionsAnalyses
            onClickDeleteWidget={() => setConfirmDeleteWidget(true)}
          />
        </StickyMenuBarWrapper>

        {/* Content */}
        <div className="container mx-auto">
          {/* Loading */}
          {loading && <Loading />}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
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
                    onChange={(e) => setWidgetName(e.target.value)}
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
                <p className="font-bold">Période</p>

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
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_247_10231)">
                          <path
                            d="M12.6667 2.66671H12V2.00004C12 1.63337 11.7 1.33337 11.3333 1.33337C10.9667 1.33337 10.6667 1.63337 10.6667 2.00004V2.66671H5.33333V2.00004C5.33333 1.63337 5.03333 1.33337 4.66667 1.33337C4.3 1.33337 4 1.63337 4 2.00004V2.66671H3.33333C2.59333 2.66671 2.00667 3.26671 2.00667 4.00004L2 13.3334C2 14.0667 2.59333 14.6667 3.33333 14.6667H12.6667C13.4 14.6667 14 14.0667 14 13.3334V4.00004C14 3.26671 13.4 2.66671 12.6667 2.66671ZM12.6667 12.6667C12.6667 13.0334 12.3667 13.3334 12 13.3334H4C3.63333 13.3334 3.33333 13.0334 3.33333 12.6667V6.00004H12.6667V12.6667ZM4.66667 7.33337H6V8.66671H4.66667V7.33337ZM7.33333 7.33337H8.66667V8.66671H7.33333V7.33337ZM10 7.33337H11.3333V8.66671H10V7.33337Z"
                            fill="#2C3E50"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_247_10231">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
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
                    )[`COLOR_${indicators.length === 0 ? index : index + 1}`];

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
              {indicators && indicators.length > 0 && (
                <div className="flex flex-col gap-4">
                  {axes &&
                    axes.length > 0 &&
                    axes
                      .filter(
                        (axe, index, self) =>
                          index === self.findIndex((a) => a?.nom === axe?.nom)
                      )
                      .map((axe, index) => {
                        const formatAxe = widget?.params.axes?.find(
                          (a) => a.id_indicator === axe?.id_indicator
                        );

                        return (
                          <AxeWidgetAutomaticManual
                            key={index}
                            axe={{ ...axe, automatic: formatAxe?.automatic }}
                            index={index}
                            widget={widget}
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
                    setSelectedPlot(null);
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
                      setSelectedPlot(null);
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

              {/* Submit */}
              <button
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

        {/* Confirm delete modal */}
        {confirmDeleteWidget && (
          <ModalDeleteConfirm
            whatToDeletTitle="ce graphique"
            handleDelete={() => handleDeleteWidget(widget?.id)}
            handleConfirmCancel={() => setConfirmDeleteWidget(false)}
          />
        )}
      </>
    </PageWrapper>
  );
};

export default UpdateWidgetClient;
