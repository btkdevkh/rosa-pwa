"use client";

import React from "react";
import Navbar from "../components/shared/Navbar";
import MenuBar from "../components/shared/MenuBar";

const AnalysePage = () => {
  return (
    <>
      <title>Rospot | Analyses</title>
      <div className="flex flex-col h-screen">
        {/* Top Nav bar */}
        <Navbar title="Analyses" back={true} />

        {/* Bottom Menu bar */}
        <div className="mt-auto">
          <MenuBar />
        </div>
      </div>
    </>
  );
};

export default AnalysePage;
