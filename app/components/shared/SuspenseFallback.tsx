import Loader from "./loaders/Loader";

const SuspenseFallback = () => {
  return (
    <div className="bg-primary px-7 py-[26px] absolute top-0 left-0 right-0 z-50">
      <div className="flex flex-col items-center gap-3 py-48 absolute top-0 left-0 right-0">
        <span>Chargement en cours (Suspense)</span>
        <Loader />
      </div>
    </div>
  );
};

export default SuspenseFallback;
