import { Observation } from "@/app/models/interfaces/Observation";
import React from "react";

type ErrorInputFormProps = {
  inputErrors: { [key: string]: string } | null;
  property: string;
  editableDelayPassed: string | boolean | null;
  lastObservation: Observation | null;
  lastObservationDate: string | null;
  nb_value?: string | number | null;
};

const ErrorInputForm = ({
  inputErrors,
  property,
  editableDelayPassed,
  lastObservation,
  lastObservationDate,
  nb_value,
}: ErrorInputFormProps) => {
  return (
    <div className="flex gap-1 items-center">
      {/* The delay has not passed yet */}
      {!editableDelayPassed && lastObservation && (
        <p
          className={`text-sm ${
            inputErrors && inputErrors[property] ? "text-error" : ""
          }`}
        >
          {inputErrors && inputErrors[property] && <>{inputErrors[property]}</>}
        </p>
      )}

      {/* The delay has passed */}
      {editableDelayPassed && lastObservation && (
        <p
          className={`text-sm ${
            inputErrors && inputErrors[property] ? "text-error" : ""
          }`}
        >
          {property === "comment" ? (
            <>
              &quot;
              {lastObservation.commentaire
                ? lastObservation.commentaire
                : "Rien à signaler"}
              &quot; le {lastObservationDate}
            </>
          ) : (
            <>
              {nb_value ?? "Non renseigné"} le {lastObservationDate}
              {inputErrors && inputErrors[property] && (
                <> - {inputErrors[property]}</>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default ErrorInputForm;
