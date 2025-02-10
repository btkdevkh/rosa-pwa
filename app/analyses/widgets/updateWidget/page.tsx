import { Suspense } from "react";
import { SearchParams } from "@/app/models/types/SearchParams";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import UpdateWidgetClient from "@/app/components/clients/analyses/widgets/updateWidget/UpdateWidgetClient";
import getWidget from "@/app/actions/widgets/getWidget";
import { Widget } from "@/app/models/interfaces/Widget";

// Url "/analyses/widgets/updateWidgetPage"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdateWidgetPage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  console.log(params?.widgetID);

  if (!params || !params.widgetID) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <UpdateWidgetClient widget={null} />
      </Suspense>
    );
  }

  const response = await getWidget(+params.widgetID);

  if (response && !response.success) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <UpdateWidgetClient widget={null} />
      </Suspense>
    );
  }
  const { widget } = response;

  return (
    <>
      <UpdateWidgetClient widget={widget as Widget} />
    </>
  );
};

export default UpdateWidgetPage;
