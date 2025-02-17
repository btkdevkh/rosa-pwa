import AddRosierClient from "@/app/components/clients/observations/rosiers/addRosier/AddRosierClient";

// Url "/observations/plots/rosiers/addRosier?plotUID=${PLOT_UID}&plotName=${PLOT_NAME}"
// This page is a server component,
// it render the client component.
const AddRosierPage = async () => {
  return <AddRosierClient />;
};

export default AddRosierPage;
