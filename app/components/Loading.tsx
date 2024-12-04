import React from "react";
import Loader from "./Loader";

type LoadingProps = {
  title?: string;
};

const Loading = ({ title = "Chargement en cours" }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center gap-3 py-48">
      <span>{title}</span>
      <Loader />
    </div>
  );
};

export default Loading;
