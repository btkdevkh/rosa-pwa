import { Suspense } from "react";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import UpdateWidgetClient from "@/app/components/clients/analyses/widgets/updateWidget/UpdateWidgetClient";

// Url "/analyses/widgets/updateWidgetPage"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const UpdateWidgetPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <UpdateWidgetClient />
    </Suspense>
  );
};

export default UpdateWidgetPage;
