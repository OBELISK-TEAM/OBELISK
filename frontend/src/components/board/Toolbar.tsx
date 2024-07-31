import React, { ChangeEvent, useRef } from "react";
import { Input } from "@/components/ui/input";

import { Bold, Italic, Underline } from "lucide-react";
import StyledLabel from "@/components/ToolbarLabel";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "../ui/button";
interface ToolBarProps {
  selectedObjectStyles?: { [key: string]: any } | null;
  onStyleChange?: (styles: { [key: string]: any }) => void;
  activeItem: string | null;
  handleAddImageByUrl: (url: string) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  selectedObjectStyles,
  onStyleChange,
  activeItem,
  handleAddImageByUrl,
}) => {
  const urlRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "number"
          ? parseInt(event.target.value, 10)
          : event.target.value;
      if (onStyleChange) {
        onStyleChange({ [key]: value });
      }
    };

  const ToolbarInput = (
    styleKey: string,
    labelText: string,
    inputType: string = "text"
  ) => {
    const isColor = inputType === "color";
    let inputClasses = "w-[5.5em]";
    if (isColor) {
      inputClasses = "w-5 h-5 p-0  rounded-full";
    }
    return (
      <div className={`flex items-center space-x-2 border-r pr-4`}>
        <StyledLabel htmlFor={styleKey}>{labelText}</StyledLabel>
        <Input
          type={inputType}
          id={styleKey}
          className={inputClasses}
          value={
            selectedObjectStyles ? selectedObjectStyles[styleKey] || "" : ""
          }
          onChange={handleChange(styleKey)}
        />
      </div>
    );
  };

  const onBoldClick = () => {
    if (onStyleChange) {
      onStyleChange({
        fontWeight:
          selectedObjectStyles?.fontWeight === "bold" ? "normal" : "bold",
      });
    }
  };

  const onItalicClick = () => {
    if (onStyleChange) {
      onStyleChange({
        fontStyle:
          selectedObjectStyles?.fontStyle === "italic" ? "normal" : "italic",
      });
    }
  };

  const onUnderlineClick = () => {
    if (onStyleChange) {
      onStyleChange({
        underline: selectedObjectStyles?.underline === false,
      });
    }
  };

  const handleAddUrlClick = () => {
    if (urlRef.current) {
      handleAddImageByUrl(urlRef.current.value);
      urlRef.current.value = "";
    }
  };

  const renderUrlControl = () => {
    return (
      <div className="flex items-center space-x-2">
        <StyledLabel htmlFor="image-url">Image URL:</StyledLabel>
        <Input type="text" id="image-url" className="w-64" ref={urlRef} />
        <Button
          variant="mild"
          className="p-2 bg-blue-500 text-white rounded"
          onClick={handleAddUrlClick}
        >
          Add Image
        </Button>
      </div>
    );
  };

  const renderTextControls = () => (
    <>
      {selectedObjectStyles?.fill !== undefined &&
        ToolbarInput("fill", "Color", "color")}
      {selectedObjectStyles?.fontSize !== undefined &&
        ToolbarInput("fontSize", "Font Size", "number")}
      <div className="flex items-center space-x-2">
        <StyledLabel>Font styles</StyledLabel>
        <Toggle
          aria-label="Toggle bold"
          pressed={selectedObjectStyles?.fontWeight === "bold"}
          onPressedChange={onBoldClick}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Toggle italic"
          pressed={selectedObjectStyles?.fontStyle === "italic"}
          onPressedChange={onItalicClick}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Toggle underline"
          pressed={selectedObjectStyles?.underline === true}
          onPressedChange={onUnderlineClick}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
      </div>
    </>
  );

  const renderRectangleControls = () => (
    <>
      {selectedObjectStyles?.fill !== undefined &&
        ToolbarInput("fill", "Color", "color")}

      {selectedObjectStyles?.stroke !== undefined &&
        ToolbarInput("stroke", "Stroke Color", "color")}

      {selectedObjectStyles?.strokeWidth !== undefined &&
        ToolbarInput("strokeWidth", "Stroke Width", "number")}
      {selectedObjectStyles?.width !== undefined &&
        ToolbarInput("width", "Width", "number")}
      {selectedObjectStyles?.height !== undefined &&
        ToolbarInput("height", "Height", "number")}

      {selectedObjectStyles?.angle !== undefined &&
        ToolbarInput("angle", "Angle", "number")}
    </>
  );

  const renderCircleControls = () => (
    <>
      {selectedObjectStyles?.fill !== undefined &&
        ToolbarInput("fill", "Color", "color")}

      {selectedObjectStyles?.stroke !== undefined &&
        ToolbarInput("stroke", "Stroke Color", "color")}

      {selectedObjectStyles?.strokeWidth !== undefined &&
        ToolbarInput("strokeWidth", "Stroke Width", "number")}
      {selectedObjectStyles?.radius !== undefined &&
        ToolbarInput("radius", "Radius", "number")}
      {selectedObjectStyles?.angle !== undefined &&
        ToolbarInput("angle", "Angle", "number")}
    </>
  );

  const renderPathControls = () => (
    <>
      {selectedObjectStyles?.stroke !== undefined &&
        ToolbarInput("stroke", "Stroke Color", "color")}
      {selectedObjectStyles?.strokeWidth !== undefined &&
        ToolbarInput("strokeWidth", "Stroke Width", "number")}
    </>
  );

  const renderLineControls = () => (
    <>
      {selectedObjectStyles?.stroke !== undefined &&
        ToolbarInput("stroke", "Stroke Color", "color")}
        {selectedObjectStyles?.width !== undefined &&
        ToolbarInput("width", "Width", "number")}
      {selectedObjectStyles?.height !== undefined &&
        ToolbarInput("height", "Height", "number")}
      {selectedObjectStyles?.angle !== undefined &&
          ToolbarInput("angle", "Angle", "number")}
    </>
  );

  const renderControls = () => {
    if (!selectedObjectStyles) return null;
    switch (selectedObjectStyles.type) {
      case "i-text":
        return renderTextControls();
      case "rect":
        return renderRectangleControls();
      case "circle":
        return renderCircleControls();
      case "path":
        return renderPathControls();
      case "line":
        return renderLineControls();
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center bg-white w-full justify-between h-[50px]">
      <div className="flex items-center p-2 space-x-4">
        {activeItem === "add-image-url" && renderUrlControl()}

        {!(activeItem === "add-image-url") && renderControls()}
      </div>
    </div>
  );
};

export default ToolBar;