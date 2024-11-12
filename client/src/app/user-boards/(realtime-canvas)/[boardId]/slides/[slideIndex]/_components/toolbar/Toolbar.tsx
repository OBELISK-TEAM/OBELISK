"use client";
import React from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import UrlControl from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_components/toolbar/controls/UrlControl";
import ObjectSpecificControls from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_components/toolbar/controls/ObjectSpecificControls";
import { ToolbarProvider } from "@/contexts/ToolbarContext";

const BoardToolBar: React.FC = () => {
  const {
    state: { activeItem },
  } = useCanvas();
  return (
    <ToolbarProvider>
      <div className="flex h-[50px] w-full items-center justify-between bg-background text-muted-foreground">
        <div className="flex items-center space-x-4 p-2">
          {activeItem === MenuActions.ADD_IMAGE_URL ? <UrlControl /> : <ObjectSpecificControls />}
        </div>
      </div>
    </ToolbarProvider>
  );
};

export default BoardToolBar;
