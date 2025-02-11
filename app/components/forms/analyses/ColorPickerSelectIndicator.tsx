import { useState } from "react";
import SingleSelect from "../../selects/SingleSelect";
import { DataVisualization } from "@/app/models/enums/DataVisualization";
import { Indicateurs } from "@prisma/client";

type ColorPickerSelectIndicatorProps = {
  indicateur: Indicateurs;
};

const ColorPickerSelectIndicator = ({
  indicateur,
}: ColorPickerSelectIndicatorProps) => {
  console.log(indicateur);

  const [isClearable, setIsClearable] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1 w-full">
        <div>
          <input
            className="input-ghost h-7 w-6"
            type="color"
            name="color-1"
            value={DataVisualization.COLOR_1}
            onChange={e => console.log(e.target.value)}
          />
        </div>
        {/* Select Indicator */}
        <div className="w-full">
          <SingleSelect
            data={[]}
            selectedOption={{ label: "", value: "", id: 1 }}
            isClearable={isClearable}
            setSelectedOption={() => {
              console.log(123);
            }}
            setIsClearable={setIsClearable}
          />
        </div>
      </div>
    </>
  );
};

export default ColorPickerSelectIndicator;
