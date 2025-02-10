import React, { ReactNode } from "react";

type StickyMenuBarWrapperProps = {
  children: ReactNode;
};

const StickyMenuBarWrapper = ({ children }: StickyMenuBarWrapperProps) => {
  return <div className="sticky top-[52px] z-40">{children}</div>;
};

export default StickyMenuBarWrapper;
