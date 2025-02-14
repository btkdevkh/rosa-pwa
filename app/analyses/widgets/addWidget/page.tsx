import { Suspense } from "react";
import AddWidgetClient from "@/app/components/clients/analyses/widgets/addWidget/AddWidgetClient";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";

// Url "/analyses/widgets/addWidgetPage"
// This page is a server component,
// it render the client compoent with "Suspense"
// that lets you display a fallback until
// its children have finished loading.
const AddWidgetPage = async () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AddWidgetClient />
    </Suspense>
  );
};

export default AddWidgetPage;
