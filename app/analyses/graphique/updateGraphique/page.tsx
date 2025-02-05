import { Suspense } from "react";
import { SearchParams } from "@/app/models/types/SearchParams";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import UpdateGraphiquePageClient from "@/app/components/clients/analyses/graphique/updateGraphique/UpdateGraphiquePageClient";
import getGraphique from "@/app/actions/widgets/graphique/getGraphique";
import { Widget } from "@/app/models/interfaces/Widget";

// Url "/analyses/graphique/updateGraphique"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const UpdateGraphiquePage = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  console.log(params?.widgetID);

  if (!params || !params.widgetID) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <UpdateGraphiquePageClient widget={null} />
      </Suspense>
    );
  }

  const response = await getGraphique(+params.widgetID);

  if (response && !response.success) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <UpdateGraphiquePageClient widget={null} />
      </Suspense>
    );
  }
  const { widget } = response;

  return (
    <>
      <UpdateGraphiquePageClient widget={widget as Widget} />
    </>
  );
};

export default UpdateGraphiquePage;
