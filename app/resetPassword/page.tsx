import { Suspense } from "react";
import ResetPasswordClient from "../components/clients/resetPassword/ResetPasswordClient";
import SuspenseFallback from "../components/shared/SuspenseFallback";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ResetPasswordClient />
    </Suspense>
  );
};

export default ResetPasswordPage;
