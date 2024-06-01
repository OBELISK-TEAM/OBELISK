'use client';
import { useEffect, useRef, useState } from "react";
import CommandMenu from '@/components/CommandMenu';
import {
  initializeCanvas,
  toggleDrawingMode
} from "@/lib/fabricCanvasUtils";
import useMenuData from "@/hooks/canvas-menu";

const EditableCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    setCanvas(newCanvas);

    return () => {
      newCanvas?.dispose();
    };
  }, []);

  const { menuList, dropDownMenu} = useMenuData(canvas);

  return (
    <div className="flex h-screen">
      <div className="fixed top-0  max-h-[100vh] overflow-y-auto flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4 ">
        <div className="grow">
          <CommandMenu
            menuList={menuList}
            dropDownMenu={dropDownMenu}
          />
        </div>
      </div>
      <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg w-full ml-[300px]" style={{
        width: 'calc(100% - 300px)',
      }}>
        <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded-lg shadow-lg w-full h-full"
            width={800}
            height={600}
            onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};

export default EditableCanvas;
