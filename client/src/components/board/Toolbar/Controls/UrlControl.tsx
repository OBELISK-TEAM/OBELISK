import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import StyledLabel from "@/components/board/Toolbar/ToolbarLabel";
import { useFile } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";
// used when we click on the "Add Image from URL" button in the toolbar
const UrlControl: React.FC = () => {
  const { handleAddImageByUrl } = useFile();
  const urlRef = useRef<HTMLInputElement | null>(null);

  const handleAddUrlClick = () => {
    if (urlRef.current) {
      handleAddImageByUrl(urlRef.current.value);
      urlRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <StyledLabel htmlFor="image-url">Image URL:</StyledLabel>
      <Input type="text" id="image-url" className="w-64" ref={urlRef} />
      <Button onClick={handleAddUrlClick}>Add Image</Button>
    </div>
  );
};

export default UrlControl;
