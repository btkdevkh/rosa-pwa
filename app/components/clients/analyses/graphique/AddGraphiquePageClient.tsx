"use client";

import { FormEvent, useEffect, useState } from "react";
import PageWrapper from "@/app/components/shared/PageWrapper";
import toastError from "@/app/helpers/notifications/toastError";
import ErrorInputForm from "@/app/components/shared/ErrorInputForm";

// React Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SingleSelect, {
  OptionType,
} from "@/app/components/selects/SingleSelect";
import { periodsType } from "@/app/mockedData";

const AddGraphiquePageClient = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState<{
    [key: string]: string;
  } | null>(null);
  const [isClearable, setIsClearable] = useState(false);
  const [checkedPeriod1, setCheckedPeriod1] = useState(true);
  const [checkedPeriod2, setCheckedPeriod2] = useState(false);

  const [title, setTitle] = useState("");
  const year = new Date().getFullYear();
  const defaultStartDate = new Date(`${year}-01-01`);
  const defaultEndDate = new Date(`${year}-12-31`);
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [selectedPeriod, setSelectedPeriod] = useState<OptionType | null>(
    periodsType[2]
  );

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
    setLoading(true);
    setInputErrors(null);
    const error: { [key: string]: string } = {};

    // VALIDATIONS (fields)
    // Titre
    if (!title) {
      error.title = "Veuillez donner un titre à ce graphique";

      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        title: error.title,
      }));
    }
    if (title && title.length > 100) {
      error.title = "Le titre ne peut pas dépasser 100 caractères";

      setLoading(false);
      return setInputErrors(o => ({
        ...o,
        title: error.title,
      }));
    }

    // Période

    //-----------------------------------
    // Process to DB
    const graphique = {
      title,
    };
    console.log("graphique :", graphique);
    setLoading(false);
  };

  // Errors display
  useEffect(() => {
    if (inputErrors) {
      toastError(
        "Veuillez revoir les champs indiqués pour continuer",
        "error-inputs"
      );
    }
  }, [inputErrors]);

  return (
    <>
      <PageWrapper
        pageTitle="Rospot | Créer un graphique"
        navBarTitle="Créer un graphique"
        back={true}
        pathUrl="/analyses"
      >
        {/* Content */}
        <div className="container mx-auto">
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
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </label>

                {/* Error */}
                <ErrorInputForm inputErrors={inputErrors} property="title" />
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
                    onChange={e => setCheckedPeriod1(e.target.checked)}
                  />

                  <div
                    className="w-full relative"
                    onClick={() => {
                      setCheckedPeriod1(true);
                      setCheckedPeriod2(false);
                    }}
                  >
                    <DatePicker
                      startDate={startDate}
                      endDate={endDate}
                      onChange={handleChangeDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select a month other than the disabled months"
                      selectsRange
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
                    onChange={e => setCheckedPeriod2(e.target.checked)}
                  />

                  <div
                    className="w-full"
                    id="period"
                    onClick={() => {
                      setCheckedPeriod2(true);
                      setCheckedPeriod1(false);
                    }}
                  >
                    <SingleSelect
                      data={periodsType}
                      selectedOption={selectedPeriod}
                      isClearable={isClearable}
                      setSelectedOption={setSelectedPeriod}
                      setIsClearable={setIsClearable}
                    />
                  </div>
                </div>
              </div>

              {/* Indicateurs */}

              <button
                className={`btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md`}
              >
                {loading ? (
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

export default AddGraphiquePageClient;
