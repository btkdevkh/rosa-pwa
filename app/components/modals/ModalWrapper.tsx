import React, { ReactNode } from "react";
type ModalWrapperProps = {
  children: ReactNode;
  closeOptionModal: () => void;
};

const ModalWrapper = ({ children, closeOptionModal }: ModalWrapperProps) => {
  return (
    <div
      id="wrapper_modal"
      className="fixed top-0 z-50 p-4 w-screen h-screen bg-black bg-opacity-50"
      onClick={e => {
        const target = e.target as HTMLDivElement;
        if (target.id === "wrapper_modal") {
          closeOptionModal();
        }
      }}
    >
      <div className="absolute top-1 right-0 mt-12 text-sm">
        <div className="bg-surface1 px-4 py-2 w-full rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
