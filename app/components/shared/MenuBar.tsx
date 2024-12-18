import { useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuBarType } from "../../models/types/MenuBarType";
import { RouteDetectorContext } from "../../context/RouteDetectorContext";
import { MenuTitle } from "../../models/enums/MenuTitleEnum";

type MenuBarProps = {
  emptyData?: boolean;
};

const MenuBar = ({ emptyData }: MenuBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { previousPathname, setHasClickedOnButtonInMenuBar } =
    useContext(RouteDetectorContext);

  useEffect(() => {
    menus.forEach(menu => {
      if (
        pathname === "/" &&
        menu.isActive &&
        menu.title === MenuTitle.SETTINGS
      ) {
        router.push(menu.path);
      }
    });
  }, [pathname, router]);

  return (
    <div className="bg-white p-2 fixed left-0 right-0 bottom-0 z-50">
      <div className="flex justify-evenly">
        {menus
          // Filtered isActive temporarily
          .filter(m => m.isActive)
          .map(m => (
            <div
              className={`flex flex-col justify-center items-center cursor-pointer text-xs ${
                pathname.includes(m.path) ? "text-primary" : "text-txton1"
              }`}
              key={m.id}
              onClick={() => {
                setHasClickedOnButtonInMenuBar(true);

                // Update pathname
                if (previousPathname) {
                  previousPathname.current = m.path;
                }

                const generic_confirm_modal = document.getElementById(
                  "generic_confirm_modal"
                ) as HTMLDialogElement;

                if (!emptyData && generic_confirm_modal) {
                  generic_confirm_modal.showModal();
                } else {
                  addActiveMenuItem(m);

                  if (previousPathname) {
                    router.push(previousPathname.current);
                  }
                }
              }}
            >
              <span>{m.icon}</span>
              <span>{m.title}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MenuBar;

const menus: MenuBarType[] = [
  {
    id: 1,
    title: "Analyses",
    isActive: false,
    path: "/analyses",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_9_4766)">
          <path
            d="M21.3397 6.77006C20.9397 6.37006 20.2697 6.38006 19.8897 6.81006L16.5597 10.5501L10.9097 5.31006C10.1197 4.58006 8.89973 4.60006 8.13973 5.36006L2.69973 10.8101C2.30973 11.2001 2.30973 11.8301 2.69973 12.2201L2.78973 12.3101C3.17973 12.7001 3.80973 12.7001 4.19973 12.3101L9.63973 6.86006L15.2297 12.0501L13.4997 14.0001L10.9197 11.4201C10.1397 10.6401 8.86973 10.6401 8.08973 11.4201L2.69973 16.8001C2.30973 17.1901 2.30973 17.8201 2.69973 18.2101L2.79973 18.3001C3.18973 18.6901 3.81973 18.6901 4.20973 18.3001L9.50973 13.0001L12.0097 15.5001C12.8197 16.3101 14.1497 16.2701 14.9197 15.4101L16.6997 13.4001L19.8897 16.3601C20.2797 16.7201 20.8897 16.7101 21.2697 16.3301L21.2797 16.3201C21.6797 15.9201 21.6697 15.2701 21.2497 14.8901L18.0297 11.9001L21.3797 8.13006C21.7297 7.74006 21.7097 7.14006 21.3397 6.77006Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_9_4766">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Observations",
    isActive: true,
    path: "/observations",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_9_4758)">
          <path
            d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM13 17H8C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15H13C13.55 15 14 15.45 14 16C14 16.55 13.55 17 13 17ZM16 13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13ZM16 9H8C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7H16C16.55 7 17 7.45 17 8C17 8.55 16.55 9 16 9Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_9_4758">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Paramètres",
    isActive: true,
    path: "/settings",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_247_10241)">
          <path
            d="M19.4298 12.98C19.4698 12.66 19.4998 12.34 19.4998 12C19.4998 11.66 19.4698 11.34 19.4298 11.02L21.5398 9.37C21.7298 9.22 21.7798 8.95 21.6598 8.73L19.6598 5.27C19.5398 5.05 19.2698 4.97 19.0498 5.05L16.5598 6.05C16.0398 5.65 15.4798 5.32 14.8698 5.07L14.4898 2.42C14.4598 2.18 14.2498 2 13.9998 2H9.99984C9.74984 2 9.53984 2.18 9.50984 2.42L9.12984 5.07C8.51984 5.32 7.95984 5.66 7.43984 6.05L4.94984 5.05C4.71984 4.96 4.45984 5.05 4.33984 5.27L2.33984 8.73C2.20984 8.95 2.26984 9.22 2.45984 9.37L4.56984 11.02C4.52984 11.34 4.49984 11.67 4.49984 12C4.49984 12.33 4.52984 12.66 4.56984 12.98L2.45984 14.63C2.26984 14.78 2.21984 15.05 2.33984 15.27L4.33984 18.73C4.45984 18.95 4.72984 19.03 4.94984 18.95L7.43984 17.95C7.95984 18.35 8.51984 18.68 9.12984 18.93L9.50984 21.58C9.53984 21.82 9.74984 22 9.99984 22H13.9998C14.2498 22 14.4598 21.82 14.4898 21.58L14.8698 18.93C15.4798 18.68 16.0398 18.34 16.5598 17.95L19.0498 18.95C19.2798 19.04 19.5398 18.95 19.6598 18.73L21.6598 15.27C21.7798 15.05 21.7298 14.78 21.5398 14.63L19.4298 12.98ZM11.9998 15.5C10.0698 15.5 8.49984 13.93 8.49984 12C8.49984 10.07 10.0698 8.5 11.9998 8.5C13.9298 8.5 15.4998 10.07 15.4998 12C15.4998 13.93 13.9298 15.5 11.9998 15.5Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_247_10241">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
];

// Helpers funcs
const addActiveMenuItem = (m: MenuBarType) => {
  m.isActive = true;
};

// const removeActiveMenuItem = () => {
//   menus = menus.map(m => ({ ...m, isActive: false }));
// };
