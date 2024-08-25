"use client";
import React from "react";
import { useFile } from "@/contexts/FileContext";

const SlideFileInputs: React.FC = () => {
  const { handleFileChange, handleLoadImagesFromJson, fileInputRef, fileJSONInputRef } = useFile();
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
