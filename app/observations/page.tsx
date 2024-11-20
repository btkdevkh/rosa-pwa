"use client";

import React from "react";
import Navbar from "../components/Navbar";
import MenuBar from "../components/MenuBar";
import { menus } from "../page";

const ObservationPage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Nav bar */}
      <Navbar title="Parcelles" back={true} />

      {/* Bottom Menu bar */}
      <div className="mt-auto">
        <MenuBar menus={menus} />
      </div>
    </div>
  );
};

export default ObservationPage;
