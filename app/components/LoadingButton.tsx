import React from "react";

const LoadingButton = () => {
  return (
    <button className="btn btn-sm bg-primary border-none w-full hover:bg-primary h-10 rounded-md flex justify-center items-center">
      <span className="loading loading-spinner text-txton3"></span>
    </button>
  );
};

export default LoadingButton;
