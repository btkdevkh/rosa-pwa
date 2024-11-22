import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuBarType } from "../types/MenuBarType";

const MenuBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    menus.forEach(menu => {
      if (pathname === "/" && menu.isActive) {
        router.push(menu.path);
      }
    });
  }, [pathname, router]);

  return (
    <div className="bg-white p-3">
      <div className="flex justify-evenly">
        {menus
          // Filtered isActive temporarily
          .filter(m => m.isActive)
          .map(m => (
            <div
              className={`flex flex-col justify-center items-center cursor-pointer text-sm ${
                m.path === pathname ? "text-primary" : "text-txton1"
              }`}
              key={m.id}
              onClick={() => {
                removeActiveMenuItem();
                addActiveMenuItem(m);
                router.push(m.path);
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

let menus: MenuBarType[] = [
  {
    id: 1,
    title: "Analyses",
    isActive: false,
    path: "/analyses",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.9em"
        height="1.9em"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          d="m.69 11.331l1.363.338l1.026-1.611l-1.95-.482a.904.904 0 1 0-.439 1.755m17.791.261l-4.463 4.016l-5.247-4.061a.9.9 0 0 0-.338-.162l-.698-.174l-1.027 1.611l1.1.273l5.697 4.408a.915.915 0 0 0 1.168-.043l5.028-4.527a.9.9 0 0 0 .064-1.277a.91.91 0 0 0-1.284-.064M8.684 7.18l4.887 3.129a.913.913 0 0 0 1.24-.246l5.027-7.242a.9.9 0 0 0-.231-1.26a.91.91 0 0 0-1.265.23l-4.528 6.521l-4.916-3.147a.92.92 0 0 0-.688-.123a.9.9 0 0 0-.571.4L.142 17.209A.903.903 0 0 0 .908 18.6a.91.91 0 0 0 .768-.42z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Observations",
    isActive: false,
    path: "/observations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.9em"
        height="1.9em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M17 9H7V7h10m0 6H7v-2h10m-3 6H7v-2h7M12 3a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m7 0h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"
        />
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
        xmlns="http://www.w3.org/2000/svg"
        width="1.9em"
        height="1.9em"
        viewBox="0 0 1024 1024"
      >
        <path
          fill="currentColor"
          d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8c-21.1 21.2-32.8 49.2-32.8 79.1s11.7 57.9 32.8 79.1c21.2 21.1 49.2 32.8 79.1 32.8s57.9-11.7 79.1-32.8c21.1-21.2 32.8-49.2 32.8-79.1s-11.7-57.9-32.8-79.1a110.96 110.96 0 0 0-79.1-32.8m412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a442.5 442.5 0 0 0-79.6-137.7l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.3a353.4 353.4 0 0 0-98.9 57.3l-81.8-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a445.9 445.9 0 0 0-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57c0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0 0 25.8 25.7l2.7.5a448.3 448.3 0 0 0 158.8 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35m-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8s175.8 78.7 175.8 175.8s-78.7 175.8-175.8 175.8"
        />
      </svg>
    ),
  },
];

// Helpers funcs
const removeActiveMenuItem = () => {
  menus = menus.map(m => ({ ...m, isActive: false }));
};
const addActiveMenuItem = (m: MenuBarType) => {
  m.isActive = true;
};
