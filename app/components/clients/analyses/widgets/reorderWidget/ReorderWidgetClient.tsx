"use client";

import WidgetList from "./WidgetList";
import PageWrapper from "@/app/components/shared/wrappers/PageWrapper";
import useGetOnlyWidgets from "@/app/hooks/widgets/useGetOnlyWidgets";
import Loading from "@/app/components/shared/loaders/Loading";
import useCustomExplSearchParams from "@/app/hooks/useCustomExplSearchParams";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";

const ReorderWidgetClient = () => {
  const { explID, explName, dashboardID, hadDashboard } =
    useCustomExplSearchParams();
  const {
    success,
    loading,
    onlyWidgets: onlyWidgetData,
  } = useGetOnlyWidgets(dashboardID);

  const pathUrl = `${MenuUrlPath.ANALYSES}/?explID=${explID}&explName=${explName}&dashboardID=${dashboardID}&hadDashboard=${hadDashboard}`;

  return (
    <PageWrapper
      pageTitle="Rosa | Réordonner les graphiques"
      navBarTitle="Réordonner les graphiques"
      back={true}
      pathUrl={pathUrl}
    >
      {/* Content */}
      <div className="container mx-auto">
        {/* Loading */}
        {loading && <Loading />}

        {/* Infos */}
        {!success && !onlyWidgetData && (
          <div className="text-center">
            <p>Aucune donnée disponible.</p>
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
