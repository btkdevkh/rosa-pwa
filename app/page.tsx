"use client";

import React from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import MenuBar from "./components/MenuBar";
import Navbar from "./components/Navbar";

const HomePage = () => {
  const { authenticatedUser } = useContext(AuthContext);

  return (
    <>
      {authenticatedUser && (
        <div className="flex flex-col h-screen">
          {/* Top Nav bar */}
          <Navbar title={`Accueil`} />

          {/* Bottom Menu bar */}
          <div className="mt-auto">
            <MenuBar />
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
