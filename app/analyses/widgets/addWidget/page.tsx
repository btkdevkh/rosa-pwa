import getIndicators from "@/app/actions/indicateurs/getIndicators";
import AddWidgetClient from "@/app/components/clients/analyses/widgets/addWidget/AddWidgetClient";
import FallbackPageWrapper from "@/app/components/shared/FallbackPageWrapper";
import { Indicateurs } from "@prisma/client";
import { Suspense } from "react";

// Url "/analyses/widgets/addWidgetPage"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AddWidgetPage = async () => {
  const response = await getIndicators();

  if (response && !response.success) {
    return (
      <Suspense fallback={<FallbackPageWrapper />}>
        <AddWidgetClient indicators={[]} />
      </Suspense>
    );
  }

  return (
    <>
      <AddWidgetClient indicators={response.indicators as Indicateurs[]} />
    </>
  );
};

export default AddWidgetPage;
