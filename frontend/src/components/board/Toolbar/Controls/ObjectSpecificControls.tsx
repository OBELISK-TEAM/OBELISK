import React, { ChangeEvent, ReactElement } from "react";
import ToolbarInput from "@/components/board/Toolbar/ToolbarInput";
import { CanvasObjectTypes } from "@/enums/CanvasObjectTypes";
import { useCanvas } from "@/contexts/CanvasContext";
import FontStyleControls from "@/components/board/Toolbar/Controls/FontStyleControls";

// when we click on an object on the canvas, we can see the object-specific controls in the toolbar
const ObjectSpecificControls: React.FC = () => {
  const {
    state: { selectedObjectStyles },
    handleStyleChange,
  } = useCanvas();

  if (!selectedObjectStyles) {
    return null;
  }

  const handleChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === "number" ? parseInt(event.target.value, 10) : event.target.value;
    handleStyleChange?.({ [key]: value });
  };

  const controlsMap: Record<string, ReactElement[]> = {
    [CanvasObjectTypes.IText]: [
      <ToolbarInput
        key="color"
        styleKey="fill"
        labelText="Color"
        inputType="color"
        value={selectedObjectStyles.fill}
        onChange={handleChange("fill")}
      />,
      <ToolbarInput
        key="fontSize"
        styleKey="fontSize"
        labelText="Font Size"
        inputType="number"
        value={selectedObjectStyles.fontSize}
        onChange={handleChange("fontSize")}
      />,
      <FontStyleControls key="fontStyles" />,
    ],
    [CanvasObjectTypes.Rect]: [
      <ToolbarInput
        key="fill"
        styleKey="fill"
        labelText="Color"
        inputType="color"
        value={selectedObjectStyles.fill}
        onChange={handleChange("fill")}
      />,
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="strokeWidth"
        styleKey="strokeWidth"
        labelText="Stroke Width"
        inputType="number"
        value={selectedObjectStyles.strokeWidth}
        onChange={handleChange("strokeWidth")}
      />,
      <ToolbarInput
        key="width"
        styleKey="width"
        labelText="Width"
        inputType="number"
        value={selectedObjectStyles.width}
        onChange={handleChange("width")}
      />,
      <ToolbarInput
        key="height"
        styleKey="height"
        labelText="Height"
        inputType="number"
        value={selectedObjectStyles.height}
        onChange={handleChange("height")}
      />,
      <ToolbarInput
        key="angle"
        styleKey="angle"
        labelText="Angle"
        inputType="number"
        value={selectedObjectStyles.angle}
        onChange={handleChange("angle")}
      />,
    ],
    [CanvasObjectTypes.Circle]: [
      <ToolbarInput
        key="fill"
        styleKey="fill"
        labelText="Color"
        inputType="color"
        value={selectedObjectStyles.fill}
        onChange={handleChange("fill")}
      />,
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="strokeWidth"
        styleKey="strokeWidth"
        labelText="Stroke Width"
        inputType="number"
        value={selectedObjectStyles.strokeWidth}
        onChange={handleChange("strokeWidth")}
      />,
      <ToolbarInput
        key="radius"
        styleKey="radius"
        labelText="Radius"
        inputType="number"
        value={selectedObjectStyles.radius}
        onChange={handleChange("radius")}
      />,
      <ToolbarInput
        key="angle"
        styleKey="angle"
        labelText="Angle"
        inputType="number"
        value={selectedObjectStyles.angle}
        onChange={handleChange("angle")}
      />,
    ],
    [CanvasObjectTypes.Path]: [
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="strokeWidth"
        styleKey="strokeWidth"
        labelText="Stroke Width"
        inputType="number"
        value={selectedObjectStyles.strokeWidth}
        onChange={handleChange("strokeWidth")}
      />,
    ],
    [CanvasObjectTypes.Line]: [
      <ToolbarInput
        key="stroke"
        styleKey="stroke"
        labelText="Stroke Color"
        inputType="color"
        value={selectedObjectStyles.stroke}
        onChange={handleChange("stroke")}
      />,
      <ToolbarInput
        key="width"
        styleKey="width"
        labelText="Width"
        inputType="number"
        value={selectedObjectStyles.width}
        onChange={handleChange("width")}
      />,
      <ToolbarInput
        key="height"
        styleKey="height"
        labelText="Height"
        inputType="number"
        value={selectedObjectStyles.height}
        onChange={handleChange("height")}
      />,
      <ToolbarInput
        key="angle"
        styleKey="angle"
        labelText="Angle"
        inputType="number"
        value={selectedObjectStyles.angle}
        onChange={handleChange("angle")}
      />,
    ],
  };

  return controlsMap[selectedObjectStyles.type] || null;
};

export default ObjectSpecificControls;
