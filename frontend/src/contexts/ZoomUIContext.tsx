"use client";
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { ZoomOptions } from "@/enums/ZoomOptions";

interface ZoomContextProps {
  zoomValue: number;
  showZoomBadge: boolean;
  handleZoom: (newZoom: number) => void;
}

const ZoomUIContext = createContext<ZoomContextProps | undefined>(undefined);

export const ZoomUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomValue, setZoomValue] = useState<number>(0); // Track zoom percentage
  const [showZoomBadge, setShowZoomBadge] = useState<boolean>(false); // Control visibility of badge
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout

  const handleZoom = (newZoom: number) => {
    const zoomPercentage = ((newZoom - 1) / (ZoomOptions.MAX_ZOOM - 1)) * 100;
    setZoomValue(zoomPercentage);
    setShowZoomBadge(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowZoomBadge(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return <ZoomUIContext.Provider value={{ zoomValue, showZoomBadge, handleZoom }}>{children}</ZoomUIContext.Provider>;
};

export const useZoom = () => {
  const context = useContext(ZoomUIContext);
  if (!context) {
    throw new Error("useZoom must be used within a ZoomProvider");
  }
  return context;
};
