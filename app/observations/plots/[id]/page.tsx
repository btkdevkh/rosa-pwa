import IdPlotClient from "@/app/components/clients/observations/plots/idPlot/IdPlotClient";

// Url "/observations/plots/plot?plotID=${id}&plotName=${nom}"
// This page is a server component,
// it render the client component.
const IdPlotPage = async () => {
  return <IdPlotClient />;
};

export default IdPlotPage;
