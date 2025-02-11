"use client";

import WidgetList from "../WidgetList";
import { Widget } from "@/app/models/interfaces/Widget";
import PageWrapper from "@/app/components/shared/PageWrapper";

type ReorderWidgetClientProps = {
  widgets: Widget[] | null;
};

const ReorderWidgetClient = ({ widgets }: ReorderWidgetClientProps) => {
  return (
    <PageWrapper
      pageTitle="Rospot | Réordonner les graphiques"
      navBarTitle="Réordonner les graphiques"
      back={true}
      pathUrl={`/analyses`}
    >
      {/* Content */}
      <div className="container mx-auto">
        {/* Widgets */}
        <WidgetList widgets={widgets} />
      </div>
    </PageWrapper>
  );
};

export default ReorderWidgetClient;
