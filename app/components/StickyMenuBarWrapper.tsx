import React, { ReactNode } from "react";

type StickyMenuBarWrapperProps = {
  children: ReactNode;
};

const StickyMenuBarWrapper = ({ children }: StickyMenuBarWrapperProps) => {
  return (
    <div className="sticky z-40" style={{ top: "52px" }}>
      {children}
    </div>
  );
};

export default StickyMenuBarWrapper;
