import { Widget } from "@/app/models/interfaces/Widget";
import DragDropWidget from "./DragDropWidget";

type WidgetListProps = {
  widgets: Widget[] | null;
};

const WidgetList = ({ widgets }: WidgetListProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Dragable Widget */}
      <DragDropWidget widgets={widgets} />
    </div>
  );
};

export default WidgetList;
