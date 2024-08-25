import React from "react";

export interface FileContextI {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  fileJSONInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleLoadImagesFromJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddImageByUrl: (url: string) => void;
}

export interface CanvasImageI {
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  src: string;
}
