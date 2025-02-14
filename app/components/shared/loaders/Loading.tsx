import React from "react";
import Loader from "./Loader";

type LoadingProps = {
  title?: string;
};

const Loading = ({ title = "Chargement en cours" }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center gap-3 py-48 absolute top-0 left-0 right-0 z-50">
      <span>{title}</span>
      <Loader />
    </div>
  );
};

export default Loading;
