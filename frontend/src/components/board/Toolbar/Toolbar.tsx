"use client";
import React from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import UrlControl from "@/components/board/Toolbar/Controls/UrlControl";
import ObjectSpecificControls from "@/components/board/Toolbar/Controls/ObjectSpecificControls";

const BoardToolBar: React.FC = () => {
  const {
    state: { activeItem },
  } = useCanvas();

  return (
    <div className="flex h-[50px] w-full items-center justify-between bg-background text-muted-foreground">
      <div className="flex items-center space-x-4 p-2">
        {activeItem === MenuActions.AddImageUrl ? <UrlControl /> : <ObjectSpecificControls />}
      </div>
    </div>
  );
};

export default BoardToolBar;
