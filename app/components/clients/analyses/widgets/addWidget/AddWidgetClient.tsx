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
import { chantier } from "@/app/chantiers";
import { useRouter } from "next/navigation";
import { Axe } from "@/app/models/interfaces/Axe";
import { isDevEnv } from "@/app/helpers/isDevEnv";
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
import ColorPickerSelectIndicator from "@/app/components/forms/analyses/widgets/addWidget/ColorPickerSelectIndicator";
import useGetAxes from "@/app/hooks/axes/useGetAxes";
import AxeWidgetAutomaticNumber from "@/app/components/forms/analyses/widgets/addWidget/AxeWidgetAutomaticNumber";
import AxeWidgetAutomaticPercentage from "@/app/components/forms/analyses/widgets/addWidget/AxeWidgetAutomaticPercentage";
import addAxe from "@/app/actions/axes/addAxe";

registerLocale("fr", fr);

const AddWidgetClient = () => {
  const router = useRouter();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { exploitations } = useUserExploitations();
  const { loading, indicators: indicatorData } = useGetIndicators();
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
  const [selectedIndicator, setSelectedIndicator] = useState<Indicateur | null>(
    null
  );

  // Axes
  const [axes, setAxes] = useState<Axe[]>([]);

  // Filtered & format the main indictor data
  const formatIndicatorData = indicateurs
    .map(indicateur => {
      if (indicatorData && indicatorData.length > 0) {
        for (const indicatorDatum of indicatorData) {
          if (
            indicateur.nom?.toLowerCase() === indicatorDatum.nom?.toLowerCase()
          ) {
            return {
              ...indicateur,
              id: indicatorDatum.id,
              id_axe: indicatorDatum.id_axe,
            };
          } else {
            return indicateur;
          }
        }
      }
    })
    .filter(f => f != undefined)
    .filter(f => f.provenance != "Weenat"); // Uncomment when Weenat data is available

  // Format indicator options
  const indicatorOptions: OptionTypeIndicator[] = formatIndicatorData.map(
    formatIndicatorDatum => ({
      id: formatIndicatorDatum.id as number | string,
      label: formatIndicatorDatum.nom as string,
      value: formatIndicatorDatum.nom as string,
      id_axe: formatIndicatorDatum.id_axe,
      provenance: formatIndicatorDatum.provenance,
      isPercentageAxe: formatIndicatorDatum.isPercentageAxe,
      isNumberAxe: formatIndicatorDatum.isNumberAxe,
    })
  );

  // Add indicator
  const handleAddIndicator = () => {
    setCount(prev => prev + 1);

    if (count > 8) {
      setCount(9);
      return;
    }
  };

  // Remove indicator
  const handleRemoveIndicator = (index: number) => {
    setCount(prev => prev - 1);

    setIndicators(prev => {
      const newIndicators = [...prev];
      newIndicators.splice(index, 1);
      return newIndicators;
    });
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
      error.indicator = "Veuillez choisir un indicateur dans la liste";

      setLoadingOnSubmit(false);
      return setInputErrors(o => ({
        ...o,
        indicator: error.indicator,
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
        console.log("addedDashboard :", addedDashboard);

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
          },
        };

        // Si !date_auto, on passe à la date manuelle
        if (
          graphiqueWidget.params?.date_auto == false &&
          graphiqueWidget.params.mode_date_auto === ""
        ) {
          graphiqueWidget.params.date_debut_manuelle = startDate;
          graphiqueWidget.params.date_fin_manuelle = endDate;
        }

        // console.log("graphiqueWidget :", graphiqueWidget);
        // setLoadingOnSubmit(false);
        // return;

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
          },
        };

        // 1st: create axe data to DB if there no axe
        // 2nd: create indicator data to DB if there no indicator
        // 3rd: create graphique data to DB
        const widgetIndicators: Indicateur[] = [];

        if (axes && axes.length > 0) {
          for (const axe of axes) {
            const newAxe: Axe = {
              min: axe.min,
              max: axe.max,
              nom: axe.nom,
              unite: axe.unite ? "%" : null,
            };
            console.log("newAxe :", newAxe);

            // Create Axe to DB
            // const addedAxe = await addAxe(newAxe);
            // if (addedAxe && !addedAxe.success) {
            //   setLoadingOnSubmit(false);
            //   return toastError(
            //     "Une erreur est survenue pendant la création de l'axe",
            //     "create-axe-failed"
            //   );
            // }

            for (const indicator of indicators) {
              const newIndicator: Indicateur = {
                id: indicator.id as number,
                nom: indicator.nom,
                params: {
                  source: "SRC",
                },
                data_field: null,
                type_viz: null,
                id_axe: newAxe?.id as number,
                color: indicator.color as string,
                min_max: [axe.min as number, axe.max as number],
              };
              console.log("newIndicator :", newIndicator);

              // Check if the indicator already exists in the widgetIndicators
              const exists = widgetIndicators.some(
                ind =>
                  ind.nom?.toLowerCase() === newIndicator.nom?.toLowerCase()
              );
              if (!exists && axe.id_indicator === indicator.id) {
                widgetIndicators.push(newIndicator);
              }

              // Create Indicateur to DB
              // const response = await addIndicator(newIndicator);
              // if (response && !response.success) {
              //   setLoadingOnSubmit(false);
              //   return toastError(
              //     "Une erreur est survenue pendant la création de l'indicateur",
              //     "create-indicator-failed"
              //   );
              // }

              // if (response.addedIndicator) {
              //   graphiqueWidget.params.indicateurs?.push({
              //     couleur: indicator.color as string,
              //     id: response.addedIndicator.id as number,
              //     min_max: [
              //       // addedAxe.addedAxe?.min as number,
              //       // addedAxe.addedAxe?.max as number,
              //     ],
              //   });
              // }
            }
          }
        }

        console.log("widgetIndicators :", widgetIndicators);

        // graphiqueWidget.params.indicateurs?.push({
        //   couleur: indicator.color as string,
        //   id: indicator.id as number,
        //   min_max: [axe.min as number, axe.max as number],
        // });

        // Si !date_auto, on passe à la date manuelle
        if (
          graphiqueWidget.params?.date_auto == false &&
          graphiqueWidget.params.mode_date_auto === ""
        ) {
          graphiqueWidget.params.date_debut_manuelle = startDate;
          graphiqueWidget.params.date_fin_manuelle = endDate;
        }

        console.log("graphique :", graphiqueWidget);
        setLoadingOnSubmit(false);
        return;

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

  const isAxePercentageIndicator = indicators.some(
    indicator => indicator.isPercentageAxe
  );

  const isAxeNumberIndicator = indicators.some(
    indicator => indicator.isNumberAxe
  );
  const axeNumberIndicators = indicators.filter(
    indicator => indicator.isNumberAxe && indicator.isNumberAxe == true
  );

  console.log("DB DATA :");
  console.log("indicatorData :", indicatorData);
  console.log("axeData :", axeData);
  console.log("-------------------------------");

  console.log("STATE DATA :");
  console.log("formatIndicatorData :", formatIndicatorData);
  console.log("indicatorOptions :", indicatorOptions);
  console.log("count :", count);
  console.log("indicators :", indicators);
  console.log("axes :", axes);

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

              {/* Chantier 6 */}
              {isDevEnv() && chantier.CHANTIER_6.onDevelopment && (
                <>
                  <hr />
                  {`CHANTIER_6.onDevelopment: ${
                    chantier.CHANTIER_6.onDevelopment ? "En cours" : ""
                  }`}

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
                              indicatorColor={color}
                              indicators={indicators}
                              indicatorOptions={indicatorOptions}
                              setCount={setCount}
                              setIndicators={setIndicators}
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
                      {/* Fréquence et intensité (%) */}
                      <>
                        {isAxePercentageIndicator && (
                          <AxeWidgetAutomaticPercentage
                            selectedIndicator={selectedIndicator}
                            dateRange={[startDate, endDate]}
                            dateModeAuto={selectedPeriod?.value}
                            checkedDateModeAuto={checkedPeriod2}
                            setAxes={setAxes}
                          />
                        )}
                      </>

                      {/* Axes avec le nombre */}
                      <>
                        {isAxeNumberIndicator &&
                          axeNumberIndicators.length > 0 &&
                          axeNumberIndicators.map(
                            (axeNumberIndicator, index) => {
                              return (
                                <AxeWidgetAutomaticNumber
                                  key={axeNumberIndicator.id}
                                  index={index}
                                  axeNumberIndicator={axeNumberIndicator}
                                  dateRange={[startDate, endDate]}
                                  dateModeAuto={selectedPeriod?.value}
                                  checkedDateModeAuto={checkedPeriod2}
                                  setAxes={setAxes}
                                />
                              );
                            }
                          )}
                      </>
                    </div>
                  )}
                </>
              )}

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
