"use client";

import React from "react";
import Navbar from "../components/Navbar";
import MenuBar from "../components/MenuBar";
import signout from "../firebase/auth/signout";
import SingleSelect, { OptionType } from "../components/selects/SingleSelect";

const SettingPage = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Nav bar */}
      <Navbar title="Paramètres" back={true} />

      {/* Content */}
      <div className="container">
        <button
          className="flex justify-start gap-5 btn rounded-sm border-none bg-white w-full"
          onClick={() => signout()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5l-1.97-1.97a.749.749 0 0 1 .326-1.275a.75.75 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326a.75.75 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"
            />
          </svg>
          <span className="text-txton1 font-normal">Me déconnecter</span>
        </button>

        <br />

        {/* Exploitations that user had */}
        {userExploitations.length > 1 && (
          <SingleSelect data={userExploitations} />
        )}
      </div>

      {/* Bottom Menu bar */}
      <div className="mt-auto">
        <MenuBar />
      </div>
    </div>
  );
};

export default SettingPage;

const userExploitations: OptionType[] = [
  { value: "Rospot 1", label: "Rospot 1" },
  // { value: "Rospot 2", label: "Rospot 2" },
];
