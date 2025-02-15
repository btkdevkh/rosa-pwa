import IdRosierClient from "@/app/components/clients/observations/rosiers/idRosier/IdRosierClient";

// Url "/observations/plots/rosiers/rosier?rosierID=${ID}&rosierName=${nom}&plotID=${ID}&plotName=${nom}&archived=${boolean}"
// This page is a server component,
// it render the client component.
const IdRosierPage = async () => {
  return <IdRosierClient />;
};

export default IdRosierPage;
