"use client";

import React, { useContext } from "react";
import { RouteDetectorContext } from "@/app/context/RouteDetectorContext";

type ModalGenericConfirmProps = {
  description?: string;
};

const ModalGenericConfirm = ({
  description = "Les données saisies seront perdues.",
}: ModalGenericConfirmProps) => {
  const { setHasClickedOnContinueButton } = useContext(RouteDetectorContext);

  return (
    <dialog id="generic_confirm_modal" className="modal absolute p-3">
      <div className="modal-box">
        <h2 className="font-bold">Souhaitez-vous quitter cette page ?</h2>

        {description && (
          <>
            <br />
            <p className="text-sm">{description}</p>
          </>
        )}

        <br />

        <div className="flex flex-col justify-end gap-5">
          <button
            className="btn btn-sm btn-ghost bg-primary text-txton3 text-xs h-10 rounded-md"
            onClick={() => {
              setHasClickedOnContinueButton(true);
            }}
          >
            Continuer
          </button>

          <button
            className="btn btn-sm text-primary text-xs h-10 rounded-md"
            onClick={() => {
              const generic_confirm_modal = document.getElementById(
                "generic_confirm_modal"
              ) as HTMLDialogElement;

              if (generic_confirm_modal) generic_confirm_modal.close();
            }}
          >
            Annuler
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalGenericConfirm;
