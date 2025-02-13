import Loading from "./loaders/Loading";

const SuspenseFallback = () => {
  return (
    <div className="bg-primary px-7 py-[26px] absolute top-0 left-0 right-0 z-50">
      <Loading />
    </div>
  );
};

export default SuspenseFallback;
