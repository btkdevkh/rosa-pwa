"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { RouteDetectorContext } from "@/app/context/RouteDetectorContext";

type ModalGenericConfirmProps = {
  handleConfirmContinue: () => void;
  handleConfirmCancel: () => void;
  description?: string;
  url?: string;
};

const ModalGenericConfirm = ({
  handleConfirmContinue,
  handleConfirmCancel,
  description = "Les données saisies seront perdues.",
  url,
}: ModalGenericConfirmProps) => {
  const router = useRouter();
  const { hasClickedOnBackButtonInNavBar, hasClickedOnButtonInMenuBar } =
    useContext(RouteDetectorContext);

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
            className="btn btn-sm btn-ghost bg-primary text-txton3 text-xs rounded-md"
            onClick={() => {
              handleConfirmContinue();

              // Redirect (on depend)
              // Push to "/"
              if (
                hasClickedOnBackButtonInNavBar &&
                !hasClickedOnButtonInMenuBar
              ) {
                router.push("/");
              }

              // Push to new url of menu bottom bar
              if (
                hasClickedOnButtonInMenuBar &&
                !hasClickedOnBackButtonInNavBar &&
                url
              ) {
                router.push(url);
              } else {
                // Default Push to "/"
                router.push("/");
              }
            }}
          >
            Continuer
          </button>

          <button
            className="btn btn-sm btn-outline text-primary text-xs rounded-md"
            onClick={handleConfirmCancel}
          >
            Annuler
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleConfirmCancel}>close</button>
      </form>
    </dialog>
  );
};

export default ModalGenericConfirm;
