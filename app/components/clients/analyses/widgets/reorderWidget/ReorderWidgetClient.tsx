"use client";

import WidgetList from "./WidgetList";
import { useSearchParams } from "next/navigation";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import useGetOnlyWidgets from "@/app/hooks/widgets/useGetOnlyWidgets";
import Loading from "@/app/components/shared/loaders/Loading";

const ReorderWidgetClient = () => {
  const searchParams = useSearchParams();
  const dashboardID = searchParams.get("dashboardID");
  const {
    success,
    loading,
    onlyWidgets: onlyWidgetData,
  } = useGetOnlyWidgets(dashboardID);

  return (
    <PageWrapper
      pageTitle="Rospot | Réordonner les graphiques"
      navBarTitle="Réordonner les graphiques"
      back={true}
      pathUrl={`/analyses`}
    >
      {/* Content */}
      <div className="container mx-auto">
        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {!success && !onlyWidgetData && (
          <div className="text-center">
            <p>Problèmes techniques, Veuillez revenez plus tard, Merci!</p>
          </div>
        )}

        {success && onlyWidgetData && onlyWidgetData.length > 0 && (
          <WidgetList widgets={onlyWidgetData} />
        )}
      </div>
    </PageWrapper>
  );
};

export default ReorderWidgetClient;
