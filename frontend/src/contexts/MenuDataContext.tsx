"use client";
import useUndoRedo from "@/hooks/board/useUndoRedo";
import useCanvasEventHandlers from "@/hooks/board/useCanvasEventHandlers";
import { exportToPDF, handleSave, saveImagesToLocalFile } from "@/utils/fabricCanvasUtils";
import { MenuGroup } from "@/interfaces/canva-interfaces";
import { fabric } from "fabric";
import {
  Circle,
  EraserIcon,
  Group,
  ImageIcon,
  Link as UrlIcon,
  Minus,
  MousePointer,
  Palette as Color,
  Pencil,
  Redo,
  Save,
  Scale3D as Size,
  Square,
  Text,
  Trash,
  Undo,
  Upload,
} from "lucide-react";

import { MenuActions } from "@/enums/MenuActions";
import { PencilBrush } from "fabric/fabric-impl";
import { CanvasMode } from "@/enums/CanvasMode";
import { MenuGroups } from "@/enums/MenuGroups";
import useMenuActions from "@/hooks/board/useMenuActions";
import useFileHandling from "@/hooks/board/useFileHandling";
import { useCanvas } from "@/contexts/CanvasContext";
import { createContext, useContext } from "react";
import useKeydownListener from "@/hooks/board/useKeydownListener";

interface MenuDataContextType {
  menuList: MenuGroup[];
  handleAddImageByUrl: (url: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoadImagesFromJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MenuDataContext = createContext<MenuDataContextType | undefined>(undefined);

export const MenuDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { canvas, color, size },
    setCanvasMode,
  } = useCanvas();

  const { saveState, undo, redo } = useUndoRedo(canvas);
  useCanvasEventHandlers(canvas, saveState);
  const { handleLoadImagesFromJson, handleFileChange, handleAddImageByUrl } = useFileHandling(canvas, saveState);
  const performAction = useMenuActions(canvas, color, size, saveState, setCanvasMode);
  useKeydownListener(performAction, undo, redo);

  const menuList: MenuGroup[] = [
    {
      groupName: "Drawing Tools",
      groupId: MenuGroups.drawingTools,
      items: [
        {
          action: () => {
            setCanvasMode(CanvasMode.Selection);
          },
          text: "Selection Mode",
          icon: <MousePointer />,
          name: CanvasMode.Selection,
        },
        {
          action: () => {
            if (!canvas) {
              return;
            }

            const pencilBrush = new fabric.PencilBrush(canvas);
            pencilBrush.color = color;
            pencilBrush.width = size;
            pencilBrush.decimate = 4;

            canvas.freeDrawingBrush = pencilBrush;

            setCanvasMode(CanvasMode.SimpleDrawing);
          },
          text: "Drawing Mode",
          icon: <Pencil />,
          name: CanvasMode.SimpleDrawing,
        },
        {
          action: () => {
            if (!canvas) {
              return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const eraserBrush: PencilBrush = new fabric.EraserBrush(canvas);
            eraserBrush.width = size;
            eraserBrush.decimate = 4;

            canvas.freeDrawingBrush = eraserBrush;

            setCanvasMode(CanvasMode.Eraser);
          },
          text: "Eraser Mode",
          icon: <EraserIcon />,
          name: CanvasMode.Eraser,
        },
        {
          action: () => {},
          text: "Change Color",
          icon: <Color />,
          name: MenuActions.ChangeColor,
        },
        {
          action: () => {},
          text: "Change Size",
          icon: <Size />,
          name: MenuActions.ChangeSize,
        },
        {
          text: "Add Line",
          icon: <Minus />,
          name: MenuActions.AddLine,
          action: () => performAction(MenuActions.AddLine),
        },
        {
          text: "Add Rectangle",
          icon: <Square />,
          name: MenuActions.AddRectangle,
          action: () => performAction(MenuActions.AddRectangle),
        },
        {
          text: "Add Circle",
          icon: <Circle />,
          name: MenuActions.AddCircle,
          action: () => performAction(MenuActions.AddCircle),
        },
        {
          text: "Add Text",
          icon: <Text />,
          name: MenuActions.AddText,
          action: () => performAction(MenuActions.AddText),
        },
      ],
    },
    {
      groupName: "Object Manipulation",
      groupId: MenuGroups.objectManipulation,
      items: [
        {
          action: () => performAction(MenuActions.ClearCanvas),
          text: "Clear Canvas",
          icon: <Trash />,
          name: MenuActions.ClearCanvas,
        },
        {
          text: "Add Image from URL",
          icon: <UrlIcon />,
          name: MenuActions.AddImageUrl,
          action: () => performAction(MenuActions.AddImageUrl),
        },
        {
          text: "Add Image from disk",
          icon: <ImageIcon />,
          name: MenuActions.AddImageDisk,
          action: () => performAction(MenuActions.AddImageDisk),
        },
      ],
    },
    {
      groupName: "File and Canvas Operations",
      groupId: MenuGroups.fileAndCanvasOperations,
      items: [
        {
          action: () => exportToPDF(canvas),
          text: "Export to PDF",
          icon: <Save />,
          name: MenuActions.ExportPdf,
        },
        {
          text: "Undo",
          icon: <Undo />,
          action: (e?: any) => {
            e?.preventDefault();
            undo();
          },
          name: MenuActions.Undo,
        },
        {
          text: "Redo",
          icon: <Redo />,
          action: (e?: any) => {
            e?.preventDefault();
            redo();
          },
          name: MenuActions.Redo,
        },
        {
          action: () => performAction(MenuActions.LoadCanvas),
          text: "Load Canvas",
          icon: <Upload />,
          name: MenuActions.LoadCanvas,
        },
        {
          action: () => handleSave(canvas),
          text: "Save Canvas",
          icon: <Save />,
          name: MenuActions.SaveCanvas,
        },
        {
          action: () => saveImagesToLocalFile(canvas),
          text: "Save Images",
          icon: <Save />,
          name: MenuActions.SaveImages,
        },
        {
          action: () => performAction(MenuActions.LoadImagesJson),
          text: "Load Images from JSON",
          icon: <Upload />,
          name: MenuActions.LoadImagesJson,
        },
        {
          action: () => performAction(MenuActions.GroupSelected),
          text: "Group Selected Objects",
          icon: <Group />,
          name: MenuActions.GroupSelected,
        },
        {
          action: () => performAction(MenuActions.RemoveSelected),
          text: "Remove Selected Objects",
          icon: <Trash />,
          name: MenuActions.RemoveSelected,
        },
      ],
    },
  ];

  return (
    <MenuDataContext.Provider
      value={{
        menuList,
        handleAddImageByUrl,
        handleFileChange,
        handleLoadImagesFromJson,
      }}
    >
      {children}
    </MenuDataContext.Provider>
  );
};

export const useMenuData = () => {
  const context = useContext(MenuDataContext);
  if (!context) {
    throw new Error("useMenuDataContext must be used within a MenuDataProvider");
  }
  return context;
};
