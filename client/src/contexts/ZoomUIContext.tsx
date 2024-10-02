"use client";
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { ZoomOptions } from "@/enums/ZoomOptions";
import { ZoomContext as IZoomContext } from "@/interfaces/zoom-context";
const ZoomUIContext = createContext<IZoomContext | undefined>(undefined);

export const ZoomUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomValue, setZoomValue] = useState<number>(0);
  const [showZoomBadge, setShowZoomBadge] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleZoom = useCallback(
    (newZoom: number) => {
      const zoomPercentage = ((newZoom - 1) / (ZoomOptions.MAX_ZOOM - 1)) * 100;
      setZoomValue(zoomPercentage);
      setShowZoomBadge(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowZoomBadge(false);
      }, 2000);
    },
    [setShowZoomBadge, setZoomValue]
  );

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
