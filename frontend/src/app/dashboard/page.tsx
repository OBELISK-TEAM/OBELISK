"use client";
import { useRef, useState } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import ToolBar from "@/components/dashboard/Toolbar";
import { DashboardPagination } from "@/components/dashboard/Pagination";
import HorizontalMenu from "@/components/dashboard/HorizontalMenu";
import useCanvas from "@/hooks/useCanvas";
import useMenuData from "@/hooks/useMenuData";
import useFileClick from "@/hooks/useFileClick";

const Dashboard: React.FC = () => {
  const { canvasRef, canvas, selectedObjectStyles, handleStyleChange } = useCanvas();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileJSONInputRef = useRef<HTMLInputElement | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useFileClick(activeItem, setActiveItem, fileInputRef, fileJSONInputRef);

  const { menuList, handleAddImageByUrl, handleFileChange, handleLoadImagesFromJson, color, size, setColor, setSize } = useMenuData(canvas);

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
        fromRight={true}
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
        activeCanvasObject={selectedObjectStyles}
      />
      <div className="flex">
        <DashboardSidebar
          withSettings={true}
          menuItem={addGroup}
          onIconClick={handleIconClick}
          activeItem={activeItem}
          onActiveItemChange={setActiveItem}
          color={color}
          size={size}
          handleColorChange={(e) => setColor(e.target.value)}
          handleSizeChange={(e) => setSize(Number(e.target.value))}
        />
        <DashboardSidebar
          menuItem={editGroup}
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
          <DashboardPagination />
          <input
            type="file"
            id="file-input1"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <input
            type="file"
            id="file-input2"
            style={{ display: "none" }}
            ref={fileJSONInputRef}
            onChange={handleLoadImagesFromJson}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
