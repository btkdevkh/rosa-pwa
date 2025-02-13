import { Suspense } from "react";
import LoginClient from "../components/clients/login/LoginClient";
import SuspenseFallback from "../components/shared/SuspenseFallback";

const LoginPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <LoginClient />
    </Suspense>
  );
};

export default LoginPage;
