import React from "react";

const LoadingButton = () => {
  return (
    <button className="btn bg-primary border-none w-full hover:bg-primary">
      <span className="loading loading-spinner text-txton3"></span>
    </button>
  );
};

export default LoadingButton;
