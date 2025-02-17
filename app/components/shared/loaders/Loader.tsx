const Loader = ({ color = "text-primary" }: { color?: string }) => {
  return (
    <div className="text-center">
      <span className={`loading loading-spinner ${color}`}></span>
    </div>
  );
};

export default Loader;
