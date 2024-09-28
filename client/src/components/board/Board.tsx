"use client";
import BoardHorizontalMenu from "@/components/board/HorizontalMenu";
import { MenuGroups } from "@/enums/MenuGroups";
import SlideFileInputs from "@/components/board/SlideFileInputs";

import BoardSidebar from "@/components/board/Sidebar";
import BoardToolBar from "@/components/board/Toolbar/Toolbar";
import SlideCanvas from "@/components/board/Canvas";
import { SlideControls } from "@/components/board/SlideControls/SlideControls";
import React from "react";
import { LoadingSpinner } from "@/components/loading/loading-spinner";

const Board: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <div className="flex flex-col">
      <BoardHorizontalMenu boardName={"Board 1"} groupId={MenuGroups.FILE_AND_CANVAS_OPERATIONS} />
      <div className="flex">
        <BoardSidebar withSettings={true} groupId={MenuGroups.DRAWING_TOOLS} />
        <BoardSidebar groupId={MenuGroups.OBJECT_MANIPULATION} />

        <div
          className="flex flex-col items-center bg-muted text-muted-foreground"
          style={{
            width: `calc(100% - ${2 * 56}px)`,
          }}
        >
          <BoardToolBar />
          <div className="flex flex-col">
            <SlideCanvas isLoading={isLoading} />
            <SlideControls />
          </div>
          <SlideFileInputs />
        </div>
      </div>
    </div>
  );
};

export default Board;
