import PlotsClient from "@/app/components/clients/observations/plots/PlotsClient";

// Url "/observations"
// This page is a server component,
// it render the client component.
const ObservationPage = async () => {
  return <PlotsClient />;
};

export default ObservationPage;
