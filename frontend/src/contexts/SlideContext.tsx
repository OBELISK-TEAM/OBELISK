"use client";
import React, { createContext, useContext, useRef } from "react";
import useCanvas from "@/hooks/board/useCanvas";
import useMenuData from "@/hooks/board/useMenuData";
import useFileClick from "@/hooks/board/useFileClick";
import { fabric } from "fabric";
import { MenuGroup } from "@/interfaces/canva-interfaces";
import { CanvasMode } from "@/enums/CanvasMode";

interface SlideContextType {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  canvas: fabric.Canvas | null;
  selectedObjectStyles: { [key: string]: any } | null;
  handleStyleChange: (styles: object) => void;
  activeItem: string | null;
  setActiveItem: React.Dispatch<React.SetStateAction<string | null>>;
  menuList: MenuGroup[];
  handleAddImageByUrl: (url: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoadImagesFromJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
  size: number;
  canvasMode: CanvasMode;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  fileJSONInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

export const SlideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canvasRef, canvas, selectedObjectStyles, handleStyleChange, activeItem, setActiveItem } = useCanvas();

  const {
    menuList,
    handleAddImageByUrl,
    handleFileChange,
    handleLoadImagesFromJson,
    color,
    size,
    canvasMode,
    setColor,
    setSize,
  } = useMenuData(canvas);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileJSONInputRef = useRef<HTMLInputElement | null>(null);

  useFileClick(activeItem, setActiveItem, fileInputRef, fileJSONInputRef);

  return (
    <SlideContext.Provider
      value={
        {
          canvasRef,
          canvas,
          selectedObjectStyles,
          handleStyleChange,
          activeItem,
          setActiveItem,
          menuList,
          handleAddImageByUrl,
          handleFileChange,
          handleLoadImagesFromJson,
          color,
          size,
          canvasMode,
          setColor,
          setSize,
          fileInputRef,
          fileJSONInputRef,
        } as SlideContextType
      }
    >
      {children}
    </SlideContext.Provider>
  );
};

export const useSlideContext = () => {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlideContext must be used within a SlideProvider");
  }
  return context;
};
