"use client";

import {
  FormEvent,
  useEffect,
  useState,
  use,
  Dispatch,
  SetStateAction,
} from "react";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import SingleSelect from "@/app/components/selects/SingleSelect";
import { indicateurs, periodsType } from "@/app/mockedData";
import stripSpaceLowerSTR from "@/app/helpers/stripSpaceLowerSTR";
import { Dashboard } from "@/app/models/interfaces/Dashboard";
import addDashboard from "@/app/actions/dashboards/addDashboard";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import addWidget from "@/app/actions/widgets/addWidget";
import { OptionType } from "@/app/models/types/OptionType";
import { useRouter } from "next/navigation";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import addAxe from "@/app/actions/axes/addAxe";
import addIndicator from "@/app/actions/indicateurs/addIndicator";
import { Indicateur } from "@/app/models/interfaces/Indicateur";
import { Axe } from "@/app/models/interfaces/Axe";
import { ColorIndicatorEnum } from "@/app/models/enums/ColorIndicatorEnum";
import { chantier } from "@/app/chantiers";
import getIndicators from "@/app/actions/indicateurs/getIndicators";
import getAxes from "@/app/actions/axes/getAxes";
import ColorPickerSelectIndicator from "@/app/components/forms/analyses/ColorPickerSelectIndicator";
import { isDevEnv } from "@/app/helpers/isDevEnv";
import useGetIndicators from "@/app/hooks/indicators/useGetIndicators";
import Loading from "@/app/components/shared/loaders/Loading";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { ExploitationContext } from "@/app/context/ExploitationContext";
import useUserExploitations from "@/app/hooks/exploitations/useUserExploitations";
import {
  Widget,
  WidgetHauteurEnum,
  WidgetTypeEnum,
} from "@/app/models/interfaces/Widget";
import AddPlusBigIcon from "@/app/components/shared/icons/AddPlusBigIcon";
import { DataVisualization } from "@/app/models/enums/DataVisualization";
import { OptionTypeIndicator } from "@/app/models/types/OptionTypeIndicator";
import DateIcon from "@/app/components/shared/icons/DateIcon";
import { OptionTypeDashboard } from "@/app/models/interfaces/OptionTypeDashboard";

registerLocale("fr", fr);

const AddWidgetClient = () => {
  const router = useRouter();
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const { exploitations } = useUserExploitations();
  const { loading, indicators: indicatorData } = useGetIndicators();
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

  const [selectedPeriod, setSelectedPeriod] = useState<OptionType | null>(
    periodsType[2]
  );

  // Filtered indictors
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
    .filter(f => f != undefined);

  // Format indicator options
  const indicatorOptions: OptionTypeIndicator[] = formatIndicatorData.map(
    formatIndicatorDatum => ({
      id: formatIndicatorDatum.id as number | string,
      label: formatIndicatorDatum.nom as string,
      value: formatIndicatorDatum.nom as string,
      id_axe: formatIndicatorDatum.id_axe,
    })
  );

  // Parent select options to track the option state when
  // the child select has chosen the selected option
  const [parentIndicatorOptions, setParentIndicatorOptions] = useState<
    OptionTypeIndicator[] | null
  >(null);
  const [count, setCount] = useState(1); // By default count = 1
  const [indicators, setIndicators] = useState<Indicateur[]>([]); // Indicators

  // Add indicator
  const handleAddIndicator = () => {
    setCount(prev => prev + 1);

    if (count === 9) {
      setCount(9);
      return;
    }
  };

  // Remove indicator
  const handleRemoveIndicator = (index: number) => {
    setCount(prev => prev - 1);

    const removedIndicator = indicatorOptions.find(
      indicatorOption => indicatorOption.id === indicatorOptions[index].id
    );
    console.log("removedIndicator :", removedIndicator);

    if (count === 1) {
      setCount(1);
    }

    if (removedIndicator && count <= 8) {
      // Update parent indicator options
      setParentIndicatorOptions(prevs => {
        return [
          removedIndicator,
          ...(prevs as OptionTypeIndicator[]).filter(
            prev => prev.id !== removedIndicator.id
          ),
        ];
      });

      // Set indicators
      setIndicators(prevs => {
        return (prevs as Indicateur[]).filter(
          prev => prev.id !== removedIndicator.id
        );
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

        // Get exists Axes
        const resAxes = await getAxes();
        console.log("resAxes :", resAxes);

        // Get exists indicators
        const resIndicators = await getIndicators();
        console.log("resIndicators :", resIndicators);

        // 2nd: create axe data to DB
        const newAxe: Axe = {
          min: 0,
          max: 100,
          nom: "Axe 1",
          unite: "%",
        };

        const addedAxe =
          resAxes && resAxes.success && resAxes.axes && resAxes.axes.length > 0
            ? {
                error: undefined,
                success: true,
                addedAxe: resAxes.axes[0],
              }
            : await addAxe(newAxe);

        if (addedAxe && !addedAxe.success) {
          setLoadingOnSubmit(false);
          return toastError(
            "Une erreur est survenue pendant la création de l'axe",
            "create-axe-failed"
          );
        }

        // 3rd: create indicator data to DB
        // @todo: refactor on Chantier 6
        const indicateurs = [
          "Fréquence écidies",
          "Fréquence marsonia",
          "Fréquence rouille",
          "Fréquence téleutos",
          "Fréquence urédos",
          "Intensité rouille",
          "Nombre de feuilles",
          "Humectation foliaire",
          "Humidité",
          "Précipitations",
          "Température maximum",
        ];

        const newIndicator: Indicateur = {
          nom: indicateurs[2],
          params: {
            source: "SRC",
          },
          data_field: null,
          type_viz: null,
          id_axe: addedAxe.addedAxe?.id as number,
        };

        const addedIndicator =
          resIndicators &&
          resIndicators.indicators &&
          resIndicators.indicators.length > 0
            ? {
                error: undefined,
                success: true,
                addedIndicator: resIndicators.indicators[0],
              }
            : await addIndicator(newIndicator);

        if (addedIndicator && !addedIndicator.success) {
          setLoadingOnSubmit(false);
          return toastError(
            "Une erreur est survenue pendant la création de l'indicateur",
            "create-indicator-failed"
          );
        }

        graphiqueWidget.params.indicateurs?.push({
          couleur: ColorIndicatorEnum.COLOR_1,
          id: addedIndicator.addedIndicator?.id as number,
          min_max: [
            addedAxe.addedAxe?.min as number,
            addedAxe.addedAxe?.max as number,
          ],
        });

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

        // Get exists Axes
        const resAxes = await getAxes();
        console.log("resAxes :", resAxes);

        // Get exists indicators
        const resIndicators = await getIndicators();
        console.log("resIndicators :", resIndicators);

        // 1st: create axe data to DB if there no axe
        const newAxe: Axe = {
          min: 0,
          max: 100,
          nom: "Axe 1",
          unite: "%",
        };

        const addedAxe =
          resAxes && resAxes.success && resAxes.axes && resAxes.axes.length > 0
            ? {
                error: undefined,
                success: true,
                addedAxe: resAxes.axes[0],
              }
            : await addAxe(newAxe);

        if (addedAxe && !addedAxe.success) {
          setLoadingOnSubmit(false);
          return toastError(
            "Une erreur est survenue pendant la création de l'axe",
            "create-axe-failed"
          );
        }

        // 2nd: create indicator data to DB
        // @todo: refactor on Chantier 6
        const indicateurs = [
          "Fréquence écidies",
          "Fréquence marsonia",
          "Fréquence rouille",
          "Fréquence téleutos",
          "Fréquence urédos",
          "Intensité rouille",
          "Nombre de feuilles",
          "Humectation foliaire",
          "Humidité",
          "Précipitations",
          "Température maximum",
        ];

        const newIndicator: Indicateur = {
          nom: indicateurs[2],
          params: {
            source: "SRC",
          },
          data_field: null,
          type_viz: null,
          id_axe: addedAxe.addedAxe?.id as number,
        };

        const addedIndicator =
          resIndicators &&
          resIndicators.indicators &&
          resIndicators.indicators.length > 0
            ? {
                error: undefined,
                success: true,
                addedIndicator: resIndicators.indicators[0],
              }
            : await addIndicator(newIndicator);

        if (addedIndicator && !addedIndicator.success) {
          setLoadingOnSubmit(false);
          return toastError(
            "Une erreur est survenue pendant la création de l'indicateur",
            "create-indicator-failed"
          );
        }

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

        graphiqueWidget.params.indicateurs?.push({
          couleur: ColorIndicatorEnum.COLOR_1,
          id: addedIndicator.addedIndicator?.id as number,
          min_max: [
            addedAxe.addedAxe?.min as number,
            addedAxe.addedAxe?.max as number,
          ],
        });

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

  // Set parent indicator options
  useEffect(() => {
    if (!parentIndicatorOptions && indicators.length === 0) {
      setParentIndicatorOptions(indicatorOptions);
    }
  }, [parentIndicatorOptions, indicators]);

  // Error display related to graphique
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

  console.log("indicatorData :", indicatorData);
  console.log("formatIndicatorData :", formatIndicatorData);
  console.log("------------------------------------------");
  console.log("parentIndicatorOptions :", parentIndicatorOptions);
  console.log("count :", count);
  console.log("indicators :", indicators);

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
                  {`CHANTIER_6.onDevelopment: ${chantier.CHANTIER_6.onDevelopment}`}

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
                      {Array.from({ length: count }).map((indicator, index) => {
                        const color = (
                          DataVisualization as { [key: string]: string }
                        )[`COLOR_${index}`];

                        return (
                          <div className="w-full" key={index}>
                            <ColorPickerSelectIndicator
                              index={index}
                              indicatorColor={color}
                              indicators={indicators}
                              setCount={setCount}
                              setIndicators={setIndicators}
                              setParentIndicatorOptions={
                                setParentIndicatorOptions
                              }
                              handleRemoveIndicator={handleRemoveIndicator}
                              indicatorOptions={indicatorOptions}
                              formatIndicatorData={formatIndicatorData}
                              parentIndicatorOptions={parentIndicatorOptions}
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
                  {isDevEnv() && chantier.CHANTIER_6.unMask && (
                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="font-bold">
                          Axe 1 - Fréquence et intensité (%)
                        </p>
                      </div>

                      <div>
                        <p className="font-bold">Axe 2 - Précipitations (mm)</p>
                      </div>
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
