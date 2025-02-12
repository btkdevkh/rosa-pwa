import React from "react";
import Loading from "./Loading";

const FallbackPageWrapper = () => {
  return (
    <div className="bg-primary text-txton3 px-7 py-[26px] absolute top-0 left-0 right-0 -z-50">
      <Loading />
    </div>
  );
};

export default FallbackPageWrapper;
