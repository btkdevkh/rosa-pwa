"use client";

import React from "react";

type ModalDeleteConfirmProps = {
  handleConfirmDelete: () => void;
  handleDelete: () => void;
};

const ModalDeleteConfirm = ({
  handleConfirmDelete,
  handleDelete,
}: ModalDeleteConfirmProps) => {
  return (
    <dialog id="delete_confirm_modal" className="modal">
      <div className="modal-box">
        <p className="text-sm">
          Souhaitez-vous supprimer cette parcelle ? Toutes les observations
          enregistrées sur les rosiers de cette parcelle seront perdues.
        </p>

        <br />

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-sm btn-ghost bg-unselected text-txton3 text-xs rounded-md"
            onClick={handleConfirmDelete}
          >
            Annuler
          </button>
          <button
            className="btn btn-sm btn-ghost bg-confirmation text-txton3 text-xs rounded-md"
            onClick={handleDelete}
          >
            Confirmer
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleConfirmDelete}>close</button>
      </form>
    </dialog>
  );
};

export default ModalDeleteConfirm;
