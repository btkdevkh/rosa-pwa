"use client";

import React from "react";

type ModalDeleteConfirmProps = {
  whatToDeletTitle: string;
  handleDelete: () => void;
  handleConfirmCancel: () => void;
  description?: string;
};

const ModalDeleteConfirm = ({
  whatToDeletTitle,
  handleDelete,
  handleConfirmCancel,
  description,
}: ModalDeleteConfirmProps) => {
  return (
    <dialog id="delete_confirm_modal" className="modal absolute p-3">
      <div className="modal-box">
        <h2 className="font-bold">
          Voulez-vous vraiment
          <br />
          supprimer{" "}
          {whatToDeletTitle === "parcelle"
            ? `cette parcelle`
            : whatToDeletTitle}{" "}
          ?
        </h2>

        {description && (
          <>
            <br />
            <p className="text-sm">{description}</p>
          </>
        )}

        <br />

        <div className="flex flex-col justify-end gap-5">
          <button
            className="btn btn-sm btn-ghost bg-error text-txton3 text-xs h-10 rounded-md"
            onClick={handleDelete}
          >
            Supprimer{" "}
            {whatToDeletTitle === "parcelle" ? `la parcelle` : whatToDeletTitle}
          </button>

          <button
            className="btn btn-sm text-primary text-xs h-10 rounded-md"
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

export default ModalDeleteConfirm;
