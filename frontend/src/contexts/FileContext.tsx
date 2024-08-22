"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { addImage, fitImageByShrinking, loadImagesFromJSON, saveImagesToLocalFile } from "@/utils/fabricCanvasUtils";
import { useUndoRedo } from "@/contexts/UndoRedoContext";

interface FileContextType {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  fileJSONInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleLoadImagesFromJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddImageByUrl: (url: string) => void;
  handleSaveImages: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { activeItem, canvas },
    setActiveItem,
  } = useCanvas();
  const { saveState } = useUndoRedo();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileJSONInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (activeItem === MenuActions.AddImageDisk) {
      fileInputRef.current?.click();
      setActiveItem(null);
    } else if (activeItem === MenuActions.LoadImagesJson) {
      fileJSONInputRef.current?.click();
      setActiveItem(null);
    }
  }, [activeItem, setActiveItem, fileInputRef, fileJSONInputRef]);

  const handleLoadImagesFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          loadImagesFromJSON(canvas, result as string);
          saveState();
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          fitImageByShrinking(result as string, 800, 600, (resizedImage) => {
            addImage(canvas, resizedImage);
            saveState();
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageByUrl = (url: string) => {
    if (canvas) {
      addImage(canvas, url);
      saveState();
    }
  };

  const handleSaveImages = () => {
    saveImagesToLocalFile(canvas);
  };

  return (
    <FileContext.Provider
      value={{
        fileInputRef,
        fileJSONInputRef,
        handleLoadImagesFromJson,
        handleFileChange,
        handleAddImageByUrl,
        handleSaveImages,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
