import UpdateRosierClient from "@/app/components/clients/observations/rosiers/updateRosier/UpdateRosierClient";

// Url "/observations/plots/rosiers/updateRosier?uid=${UID}&nom=${NOM}&plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component,
// it render the client component.
const UpdateRosierPage = async () => {
  return <UpdateRosierClient />;
};

export default UpdateRosierPage;
