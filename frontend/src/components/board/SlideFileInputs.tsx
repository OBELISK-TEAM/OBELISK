"use client";
import React from "react";
import { useFileContext } from "@/contexts/FileContext";
import { useMenuData } from "@/contexts/MenuDataContext";

const SlideFileInputs: React.FC = () => {
  const { handleFileChange, handleLoadImagesFromJson } = useMenuData();
  const { fileInputRef, fileJSONInputRef } = useFileContext();
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
