"use client";
import { useRef, useState } from "react";
import BoardSidebar from "@/components/board/Sidebar";
import ToolBar from "@/components/board/Toolbar";
import { BoardPagination } from "@/components/board/Pagination";
import HorizontalMenu from "@/components/board/HorizontalMenu";
import useCanvas from "@/hooks/board/useCanvas";
import useMenuData from "@/hooks/board/useMenuData";
import useFileClick from "@/hooks/board/useFileClick";
import { MenuAction } from "@/enums/MenuActions";

const Board: React.FC = () => {
  const { canvasRef, canvas, selectedObjectStyles, handleStyleChange } =
    useCanvas();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileJSONInputRef = useRef<HTMLInputElement | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(MenuAction.SelectionMode);

  useFileClick(activeItem, setActiveItem, fileInputRef, fileJSONInputRef);

  const {
    menuList,
    handleAddImageByUrl,
    handleFileChange,
    handleLoadImagesFromJson,
    color,
    size,
    setColor,
    setSize,
  } = useMenuData(canvas);

  const [addGroup, editGroup, fileGroup] = menuList;

  const handleIconClick = (name: string) => {
    setActiveItem(name);
  };

  return (
    <div className="flex flex-col">
      <HorizontalMenu
        boardName="Board 1"
        menuItem={fileGroup}
        onIconClick={handleIconClick}
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
        activeCanvasObject={selectedObjectStyles}
      />
      <div className="flex">
        <BoardSidebar
          withSettings={true}
          menuGroup={addGroup}
          onIconClick={handleIconClick}
          activeItem={activeItem}
          onActiveItemChange={setActiveItem}
          color={color}
          size={size}
          handleColorChange={(e) => setColor(e.target.value)}
          handleSizeChange={(e) => setSize(Number(e.target.value))}
        />
        <BoardSidebar
          menuGroup={editGroup}
          onIconClick={handleIconClick}
          activeItem={activeItem}
          onActiveItemChange={setActiveItem}
          color={color}
          size={size}
          handleColorChange={(e) => setColor(e.target.value)}
          handleSizeChange={(e) => setSize(Number(e.target.value))}
        />
        <div
          className="flex flex-col items-center bg-[#F1F5F9]"
          style={{
            width: `calc(100% - ${2 * 56}px)`,
          }}
        >
          <ToolBar
            selectedObjectStyles={selectedObjectStyles}
            onStyleChange={handleStyleChange}
            activeItem={activeItem}
            handleAddImageByUrl={handleAddImageByUrl}
          />
          <div className="flex bg-white w-fit rounded-lg mt-4">
            <canvas
              ref={canvasRef}
              className="border rounded-lg"
              width={1000}
              height={550}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <BoardPagination />
          <input
            type="file"
            id="file-input1"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <input
            type="file"
            id="file-input2"
            className="hidden"
            ref={fileJSONInputRef}
            onChange={handleLoadImagesFromJson}
          />
        </div>
      </div>
    </div>
  );
};

export default Board;
