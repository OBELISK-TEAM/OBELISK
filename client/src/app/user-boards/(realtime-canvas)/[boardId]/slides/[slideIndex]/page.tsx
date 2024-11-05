"use client";
import BoardSidebar from "@/components/board/Sidebar";
import BoardHorizontalMenu from "@/components/board/HorizontalMenu";
import { MenuGroups } from "@/enums/MenuGroups";
import SlideCanvas from "@/components/board/Canvas";
import SlideFileInputs from "@/components/board/SlideFileInputs";
import BoardToolBar from "@/components/board/toolbar/Toolbar";
import { useScrollToTop } from "@/hooks/window/useScrollToTop";
import { useSocket } from "@/contexts/SocketContext";
const Board: React.FC = () => {
  useScrollToTop();
  const { userCapabilities } = useSocket();
  const canvasWrapperWidth = userCapabilities.canManageObject ? `calc(100% - ${2 * 56}px)` : "100%";
  return (
    <div className="flex flex-col">
      <BoardHorizontalMenu groupId={MenuGroups.FILE_AND_CANVAS_OPERATIONS} userCapabilities={userCapabilities} />
      <div className="flex">
        {userCapabilities.canManageObject && (
          <>
            <BoardSidebar withSettings={true} groupId={MenuGroups.DRAWING_TOOLS} />
            <BoardSidebar groupId={MenuGroups.OBJECT_MANIPULATION} />
          </>
        )}
        <div
          className="flex flex-col items-center bg-muted text-muted-foreground"
          style={{
            width: canvasWrapperWidth,
            height: "calc(100vh - 64px)",
          }}
        >
          {userCapabilities.canManageObject && <BoardToolBar />}
          <SlideCanvas />
          {userCapabilities.canManageObject && <SlideFileInputs />}
        </div>
      </div>
    </div>
  );
};

export default Board;
