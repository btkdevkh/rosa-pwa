import { useEffect, useState } from "react";

const useSimulateLoading = (milliseconds: number = 1000) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const simulatePromise = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, milliseconds));
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };

    simulatePromise();
  }, [milliseconds]);

  return { loading };
};

export default useSimulateLoading;
