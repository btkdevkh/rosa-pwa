import { Suspense } from "react";
import getWidget from "@/app/actions/widgets/getWidget";
import { Widget } from "@/app/models/interfaces/Widget";
import { SearchParams } from "@/app/models/types/SearchParams";
import SuspenseFallback from "@/app/components/shared/SuspenseFallback";
import UpdateWidgetClient from "@/app/components/clients/analyses/widgets/updateWidget/UpdateWidgetClient";

// Url "/analyses/widgets/updateWidgetPage"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdateWidgetPage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  if (!params || !params.widgetID) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <UpdateWidgetClient widget={null} />
      </Suspense>
    );
  }

  const response = await getWidget(+params.widgetID);

  if (response && !response.success) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <UpdateWidgetClient widget={null} />
      </Suspense>
    );
  }
  const { widget } = response;

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <UpdateWidgetClient widget={widget as Widget} />
    </Suspense>
  );
};

export default UpdateWidgetPage;
