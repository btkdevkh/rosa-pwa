import { use } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuBarType } from "../../../models/types/MenuBarType";
import { RouteDetectorContext } from "../../../context/RouteDetectorContext";
import Link from "next/link";
import GraphIcon from "../icons/GraphIcon";
import ObsIcon from "../icons/ObsIcon";
import SettingBigGearIcon from "../icons/SettingBigGearIcon";

type MenuBarProps = {
  emptyData?: boolean;
};

const MenuBar = ({ emptyData }: MenuBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { previousPathname, setHasClickedOnButtonInMenuBar } =
    use(RouteDetectorContext);

  return (
    <div className="bg-white border border-t-txton2 p-2 fixed left-0 right-0 bottom-0 z-50">
      <div className="flex justify-evenly">
        {menus
          .filter(menu => menu.isActive)
          .map(menu => {
            return (
              <Link
                href={menu.path}
                prefetch={true}
                key={menu.id}
                className={`flex flex-col justify-center items-center cursor-pointer text-xs ${
                  pathname.includes(menu.path) ? "text-primary" : "text-txton1"
                }`}
                onClick={e => {
                  e.preventDefault();
                  setHasClickedOnButtonInMenuBar(true);

                  // Update pathname
                  if (previousPathname) {
                    previousPathname.current = menu.path;
                  }

                  const generic_confirm_modal = document.getElementById(
                    "generic_confirm_modal"
                  ) as HTMLDialogElement;

                  if (!emptyData && generic_confirm_modal) {
                    generic_confirm_modal.showModal();
                  } else {
                    addActiveMenuItem(menu);

                    if (previousPathname) {
                      router.push(previousPathname.current);
                    }
                  }
                }}
              >
                <span>{menu.icon}</span>
                <span>{menu.title}</span>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default MenuBar;

const menus: MenuBarType[] = [
  {
    id: 1,
    title: "Analyses",
    isActive: true,
    path: "/analyses",
    icon: <GraphIcon />,
  },
  {
    id: 2,
    title: "Observations",
    isActive: true,
    path: "/observations",
    icon: <ObsIcon />,
  },
  {
    id: 3,
    title: "Paramètres",
    isActive: true,
    path: "/settings",
    icon: <SettingBigGearIcon />,
  },
];

// Helpers funcs
const addActiveMenuItem = (m: MenuBarType) => {
  m.isActive = true;
};
