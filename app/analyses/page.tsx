import AnalysesClient from "../components/clients/analyses/AnalysesClient";

// Url "/analyses"
// This page is a server component,
// it render the client component.
const AnalysePage = async () => {
  return <AnalysesClient />;
};

export default AnalysePage;
