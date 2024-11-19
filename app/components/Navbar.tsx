import Link from "next/link";

type NavbarProps = {
  title: string;
  url: string;
};

const Navbar = ({ title, url }: NavbarProps) => {
  return (
    <div className="bg-primary text-txton3 px-7 py-3">
      <div className="flex items-center">
        <Link href={url}>
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

        <div className="text-lg text-center mr-6 flex-1">
          <span className="text-left">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
