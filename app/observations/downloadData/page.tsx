// Url "/observations/DownloadDataPage"
// This page is a server component,

import DownloadDataClient from "@/app/components/clients/observations/downloadData/DownloadDataClient";

// it render the client component.
const DownloadDataPage = async () => {
  return <DownloadDataClient />;
};

export default DownloadDataPage;
