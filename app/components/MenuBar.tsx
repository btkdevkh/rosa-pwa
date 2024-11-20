import { usePathname, useRouter } from "next/navigation";
import { MenuBottomBarType } from "../page";

type MenuBarProps = {
  menus: MenuBottomBarType[];
};

const MenuBar = ({ menus }: MenuBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-white p-3">
      <div className="flex justify-evenly">
        {menus
          // Filtered isActive temporarily
          .filter(m => m.isActive)
          .map(m => (
            <div
              className={`flex flex-col justify-center items-center text-sm ${
                m.path === pathname ? "text-primary" : "text-txton1"
              }`}
              key={m.id}
              onClick={() => router.push(m.path)}
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
