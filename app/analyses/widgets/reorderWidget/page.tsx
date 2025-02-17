import ReorderWidgetClient from "@/app/components/clients/analyses/widgets/reorderWidget/ReorderWidgetClient";

// Url "/analyses/widgets/reorderWidget?dashboardID=${ID}"
// This page is a server component,
// it render the client component.
const ReorderWidgetPage = async () => {
  return <ReorderWidgetClient />;
};

export default ReorderWidgetPage;
