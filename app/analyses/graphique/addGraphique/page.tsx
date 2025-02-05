import AddGraphiquePageClient from "@/app/components/clients/analyses/graphique/addGraphique/AddGraphiquePageClient";

// Url "/analyses/graphique/addGraphique"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AddGraphiquePage = () => {
  return (
    <>
      <AddGraphiquePageClient />
    </>
  );
};

export default AddGraphiquePage;
