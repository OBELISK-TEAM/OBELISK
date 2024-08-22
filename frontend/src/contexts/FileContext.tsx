"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";

interface FileContextType {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  fileJSONInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { activeItem },
    setActiveItem,
  } = useCanvas();
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

  return (
    <FileContext.Provider
      value={{
        fileInputRef,
        fileJSONInputRef,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};
