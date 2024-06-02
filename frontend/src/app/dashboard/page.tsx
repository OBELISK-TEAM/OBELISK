"use client";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { fabric } from "fabric";
import useMenuData from "@/hooks/canvas-menu";
import {
  initializeCanvas,
  getSelectedObjectStyles as getSelectedObjectStylesUtil,
  setSelectedObjectStyles as setSelectedObjectStylesUtil,
  updateDimensions
} from "@/lib/fabricCanvasUtils";
import ToolBar from "@/components/dashboard/Toolbar";
import { DashboardPagination } from "@/components/dashboard/Pagination";
import HorizontalMenu from "@/components/dashboard/HorizontalMenu";

const Dashboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileJSONInputRef = useRef<HTMLInputElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [selectedObjectStyles, setSelectedObjectStyles] = useState<{ [key: string]: any } | null>(null);

  const boardName = "Board 1";

  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    setCanvas(newCanvas);

    newCanvas?.on("selection:updated", () => {
      setSelectedObjectStyles(getSelectedObjectStylesUtil(newCanvas));
      console.log("Selection updated", JSON.stringify(getSelectedObjectStylesUtil(newCanvas)));
      setActiveItem(null)
    });

    newCanvas?.on("selection:created", () => {
      setSelectedObjectStyles(getSelectedObjectStylesUtil(newCanvas));
      console.log("Selection created", JSON.stringify(getSelectedObjectStylesUtil(newCanvas)));
      setActiveItem(null)
    });

    newCanvas?.on("selection:cleared", () => {
      setSelectedObjectStyles(null);
      setActiveItem(null)
    });
    
    newCanvas?.on("object:modified", (e) => {
      setSelectedObjectStyles(getSelectedObjectStylesUtil(newCanvas));
      console.log("Object modified", JSON.stringify(getSelectedObjectStylesUtil(newCanvas)));
      const obj = e.target;
      updateDimensions(obj);
      setActiveItem(null)
    });

    

    return () => {
      newCanvas?.dispose();
    };
  }, []);
  useEffect(() => {
    if (activeItem === 'add-image-disk') {
      fileInputRef.current?.click();
    }
    else if (activeItem === 'load-images-json'){
      fileJSONInputRef.current?.click();
    }
  }, [activeItem]);

  const handleStyleChange = (styles: object) => {
    if (canvas) {
      setSelectedObjectStylesUtil(canvas, styles);
      setSelectedObjectStyles(getSelectedObjectStylesUtil(canvas));
    }
  };

  const { menuList, handleAddImageByUrl, handleFileChange, handleLoadImagesFromJson, color, size, handleColorChange, handleSizeChange } = useMenuData(canvas);

  const [addGroup, editGroup, fileGroup] = menuList;
  
  const handleIconClick = (name: string) => {
    
    if (name === 'add-image-disk') {
      fileInputRef.current?.click();
      setActiveItem(null);
      
    } else if (name === 'load-images-json') {
      fileJSONInputRef.current?.click();
      setActiveItem(null);
      
    }
  };
  
  

  return (
    <div className="flex flex-col">
      <HorizontalMenu
        boardName={boardName}
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
          handleColorChange={handleColorChange}
          handleSizeChange={handleSizeChange}
        />
        <DashboardSidebar
          menuItem={editGroup}
          onIconClick={handleIconClick}
          activeItem={activeItem}
          onActiveItemChange={setActiveItem}
          color={color}
          size={size}
          handleColorChange={handleColorChange}
          handleSizeChange={handleSizeChange}
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
