import UpdatePlotClient from "@/app/components/clients/observations/plots/updatePlot/UpdatePlotClient";

// Url "/observations/plots/updatePlot?uid=${UID}&nom=${NOM}"
// This page is a server component,
// it render the client component.
const UpdatePlotPage = () => {
  return <UpdatePlotClient />;
};

export default UpdatePlotPage;
