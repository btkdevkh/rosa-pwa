"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RouteDetectorContext } from "../../../context/RouteDetectorContext";

type NavbarProps = {
  title: string;
  back?: boolean;
  emptyData?: boolean;
  pathUrl?: string;
};

const Navbar = ({ title, back, emptyData, pathUrl }: NavbarProps) => {
  const router = useRouter();
  const { setHasClickedOnBackButtonInNavBar, previousPathname } =
    use(RouteDetectorContext);

  return (
    <div className="bg-primary text-txton3 px-7 py-3 sticky top-0 z-50">
      <div className="flex items-center">
        {/* Back button is present */}
        {back && (
          <Link
            href={pathUrl ? pathUrl : "/"}
            prefetch={true}
            onClick={e => {
              e.preventDefault();
              setHasClickedOnBackButtonInNavBar(true);

              // Update pathname
              if (previousPathname && pathUrl) {
                previousPathname.current = pathUrl;
              }

              const generic_confirm_modal = document.getElementById(
                "generic_confirm_modal"
              ) as HTMLDialogElement;

              if (!emptyData && generic_confirm_modal) {
                generic_confirm_modal.showModal();
              } else {
                if (previousPathname) {
                  router.push(previousPathname.current);
                }
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
          </Link>
        )}

        <div className={`text-lg text-center ${back ? "mr-6" : ""} flex-1`}>
          <p className="text-center">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
