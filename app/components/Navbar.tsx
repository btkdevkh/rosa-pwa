"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { RouteDetectorContext } from "../context/RouteDetectorContext";

type NavbarProps = {
  title: string;
  back?: boolean;
  emptyData?: boolean;
};

const Navbar = ({ title, back, emptyData }: NavbarProps) => {
  const router = useRouter();
  const { setHasClickedOnBackButtonInNavBar } =
    useContext(RouteDetectorContext);

  return (
    <div className="bg-primary text-txton3 px-7 py-3">
      <div className="flex items-center">
        {back && (
          <button
            onClick={() => {
              setHasClickedOnBackButtonInNavBar(true);

              if (!emptyData) {
                router.back();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="square"
                strokeMiterlimit="10"
                strokeWidth="48"
                d="M244 400L100 256l144-144M120 256h292"
              />
            </svg>
          </button>
        )}

        <div className={`text-lg text-center ${back ? "mr-6" : ""} flex-1`}>
          <span className="text-left">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
