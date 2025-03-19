"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/utils/service-worker-register";

const ServiceWorkerInit = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
};

export default ServiceWorkerInit;
