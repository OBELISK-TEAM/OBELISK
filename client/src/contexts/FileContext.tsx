"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { addImage, fitImageByShrinking, loadImagesFromJSON } from "@/lib/board/fileUtils";
import { useUndoRedo } from "@/contexts/UndoRedoContext";
import { FileContext as IFileContext } from "@/interfaces/file-context";
import { useSocket } from "./SocketContext";

const FileContext = createContext<IFileContext | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { activeItem, canvas },
    setActiveItem,
  } = useCanvas();
  const { saveCommand } = useUndoRedo();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileJSONInputRef = useRef<HTMLInputElement | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (activeItem === MenuActions.ADD_IMAGE_DISK) {
      fileInputRef.current?.click();
      setActiveItem(null);
    } else if (activeItem === MenuActions.LOAD_IMAGES_JSON) {
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
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas || !socket) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        fitImageByShrinking(result as string, 800, 600, async (resizedImage) => {
          await addImage(canvas, resizedImage, socket, saveCommand, undefined);
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageByUrl = async (url: string) => {
    if (!canvas || !socket) {
      return;
    }
    await addImage(canvas, url, socket, saveCommand, undefined);
  };

  return (
    <FileContext.Provider
      value={{
        fileInputRef,
        fileJSONInputRef,
        handleLoadImagesFromJson,
        handleFileChange,
        handleAddImageByUrl,
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
