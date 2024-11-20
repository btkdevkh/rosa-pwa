import Navbar from "../components/Navbar";

const OfflinePage = () => {
  return (
    <>
      <Navbar title="Hors ligne" url="/" />

      <div className="h-96 text-txton3 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
        <div className="fixed center left-1/2 transform -translate-x-1/2 bg-error px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9V5.25a3.75 3.75 0 117.5 0V9m-11.25 0h15A2.25 2.25 0 0123.25 11.25v9.5A2.25 2.25 0 0121 23H3a2.25 2.25 0 01-2.25-2.25v-9.5A2.25 2.25 0 013 9h1.5m7.5 5.25v4.5m4.5-4.5v4.5M6.75 14.25h10.5"
            />
          </svg>
          <span>
            Vous êtes hors ligne. Certaines fonctionnalités peuvent être
            limitées.
          </span>
        </div>
      </div>
    </>
  );
};

export default OfflinePage;
