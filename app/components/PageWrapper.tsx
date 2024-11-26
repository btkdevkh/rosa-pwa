import React, { ReactNode } from "react";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";

type PageWrapperProps = {
  children: ReactNode;
  pageTitle: string;
  navBarTitle: string;
  back?: boolean;
};

const PageWrapper = ({
  children,
  pageTitle,
  navBarTitle,
  back = false,
}: PageWrapperProps) => {
  return (
    <>
      <title>{pageTitle}</title>
      <div className="flex flex-col h-screen">
        {/* Top Nav bar */}
        <Navbar title={navBarTitle} back={back} />

        {children}

        {/* Bottom Menu bar */}
        <div className="mt-auto">
          <MenuBar />
        </div>
      </div>
    </>
  );
};

export default PageWrapper;
