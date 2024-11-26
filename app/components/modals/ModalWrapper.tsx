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
      {children}
    </div>
  );
};

export default ModalWrapper;
