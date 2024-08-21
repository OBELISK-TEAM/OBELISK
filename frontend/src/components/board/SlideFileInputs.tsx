"use client";
import React from "react";
import { useSlideContext } from "@/contexts/SlideContext";

const SlideFileInputs: React.FC = () => {
  const { fileInputRef, fileJSONInputRef, handleFileChange, handleLoadImagesFromJson } = useSlideContext();
  return (
    <>
      <input type="file" id="file-input1" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <input
        type="file"
        id="file-input2"
        className="hidden"
        ref={fileJSONInputRef}
        onChange={handleLoadImagesFromJson}
      />
    </>
  );
};

export default SlideFileInputs;
