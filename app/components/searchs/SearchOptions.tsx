import React from "react";

type SearchOptionsProp = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchOptions = ({
  query,
  setQuery,
  setShowOptionsModal,
}: SearchOptionsProp) => {
  return (
    <>
      <label className="input border-t-0 border-b-1 border-txton2 rounded-none flex items-center gap-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_247_10255)">
            <path
              d="M15.4996 14H14.7096L14.4296 13.73C15.6296 12.33 16.2496 10.42 15.9096 8.39002C15.4396 5.61002 13.1196 3.39002 10.3196 3.05002C6.08965 2.53002 2.52965 6.09001 3.04965 10.32C3.38965 13.12 5.60965 15.44 8.38965 15.91C10.4196 16.25 12.3296 15.63 13.7296 14.43L13.9996 14.71V15.5L18.2496 19.75C18.6596 20.16 19.3296 20.16 19.7396 19.75C20.1496 19.34 20.1496 18.67 19.7396 18.26L15.4996 14ZM9.49965 14C7.00965 14 4.99965 11.99 4.99965 9.50002C4.99965 7.01002 7.00965 5.00002 9.49965 5.00002C11.9896 5.00002 13.9996 7.01002 13.9996 9.50002C13.9996 11.99 11.9896 14 9.49965 14Z"
              fill="#2C3E50"
            />
          </g>
          <defs>
            <clipPath id="clip0_247_10255">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>

        {/* Search input */}
        <input
          type="text"
          className="grow"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <button
          className="btn p-0 btn-ghost"
          onClick={() => {
            setShowOptionsModal(prevState => !prevState);
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2_337)">
              <path
                d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                fill="#2C3E50"
              />
            </g>
            <defs>
              <clipPath id="clip0_2_337">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </label>
    </>
  );
};

export default SearchOptions;
