"use client";

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
import { CanvasMode } from "@/enums/CanvasMode";
import { MenuGroups } from "@/enums/MenuGroups";
import { createContext, useContext } from "react";
import { IMenuDataContext, MenuGroup } from "@/interfaces/menu-data-context";
import { useMenuActions } from "@/hooks/board/useMenuActions";
import { useUndoRedo } from "@/contexts/UndoRedoContext";

const MenuDataContext = createContext<IMenuDataContext | undefined>(undefined);

export const MenuDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { performAction } = useMenuActions();
  const { undo, redo } = useUndoRedo();
  const menuList: MenuGroup[] = [
    {
      groupName: "Drawing Tools",
      groupId: MenuGroups.drawingTools,
      items: [
        {
          action: () => performAction(CanvasMode.Selection),
          text: "Selection Mode",
          icon: <MousePointer />,
          name: CanvasMode.Selection,
        },
        {
          action: () => performAction(CanvasMode.SimpleDrawing),
          text: "Drawing Mode",
          icon: <Pencil />,
          name: CanvasMode.SimpleDrawing,
        },
        {
          action: () => performAction(CanvasMode.Eraser),
          text: "Eraser Mode",
          icon: <EraserIcon />,
          name: CanvasMode.Eraser,
        },
        {
          action: () => performAction(MenuActions.ChangeColor),
          text: "Change Color",
          icon: <Color />,
          name: MenuActions.ChangeColor,
        },
        {
          action: () => performAction(MenuActions.ChangeSize),
          text: "Change Size",
          icon: <Size />,
          name: MenuActions.ChangeSize,
        },
        {
          action: () => performAction(MenuActions.AddLine),
          text: "Add Line",
          icon: <Minus />,
          name: MenuActions.AddLine,
        },
        {
          action: () => performAction(MenuActions.AddRectangle),
          text: "Add Rectangle",
          icon: <Square />,
          name: MenuActions.AddRectangle,
        },
        {
          action: () => performAction(MenuActions.AddCircle),
          text: "Add Circle",
          icon: <Circle />,
          name: MenuActions.AddCircle,
        },
        {
          action: () => performAction(MenuActions.AddText),
          text: "Add Text",
          icon: <Text />,
          name: MenuActions.AddText,
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
          action: () => performAction(MenuActions.AddImageUrl),
          text: "Add Image from URL",
          icon: <UrlIcon />,
          name: MenuActions.AddImageUrl,
        },
        {
          action: () => performAction(MenuActions.AddImageDisk),
          text: "Add Image from disk",
          icon: <ImageIcon />,
          name: MenuActions.AddImageDisk,
        },
      ],
    },
    {
      groupName: "File and Canvas Operations",
      groupId: MenuGroups.fileAndCanvasOperations,
      items: [
        {
          action: () => performAction(MenuActions.ExportPdf),
          text: "Export to PDF",
          icon: <Save />,
          name: MenuActions.ExportPdf,
        },
        {
          action: () => undo(),
          text: "Undo",
          icon: <Undo />,
          name: MenuActions.Undo,
        },
        {
          action: () => redo(),
          text: "Redo",
          icon: <Redo />,
          name: MenuActions.Redo,
        },
        {
          action: () => performAction(MenuActions.LoadCanvas),

          text: "Load Canvas",
          icon: <Upload />,
          name: MenuActions.LoadCanvas,
        },
        {
          action: () => performAction(MenuActions.SaveCanvas),
          text: "Save Canvas",
          icon: <Save />,
          name: MenuActions.SaveCanvas,
        },
        {
          action: () => performAction(MenuActions.SaveImages),
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
        performAction,
      }}
    >
      {children}
    </MenuDataContext.Provider>
  );
};

export const useMenuData = () => {
  const context = useContext(MenuDataContext);
  if (!context) {
    throw new Error("useMenuData must be used within a MenuDataProvider");
  }
  return context;
};
