import AddWidgetClient from "@/app/components/clients/analyses/widgets/addWidget/AddWidgetClient";

// Url "/analyses/widgets/addWidgetPage"
// This page is a server component
// that use to fetch "data" from a server (if needed)
// and pass "data" to the client side component.
const AddWidgetPage = () => {
  return (
    <>
      <AddWidgetClient />
    </>
  );
};

export default AddWidgetPage;
