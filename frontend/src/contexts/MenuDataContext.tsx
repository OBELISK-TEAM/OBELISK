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
import { MenuDataContext as IMenuDataContext, MenuGroup } from "@/interfaces/menu-data-context";
import { useMenuActions } from "@/hooks/board/useMenuActions";
import { useUndoRedo } from "@/contexts/UndoRedoContext";

const MenuDataContext = createContext<IMenuDataContext | undefined>(undefined);

export const MenuDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { performAction } = useMenuActions();
  const { undo, redo } = useUndoRedo();
  const menuList: MenuGroup[] = [
    {
      groupName: "Drawing Tools",
      groupId: MenuGroups.DRAWING_TOOLS,
      items: [
        {
          action: () => performAction(CanvasMode.SELECTION),
          text: "Selection Mode",
          icon: <MousePointer />,
          name: CanvasMode.SELECTION,
        },
        {
          action: () => performAction(CanvasMode.SIMPLE_DRAWING),
          text: "Drawing Mode",
          icon: <Pencil />,
          name: CanvasMode.SIMPLE_DRAWING,
        },
        {
          action: () => performAction(CanvasMode.ERASER),
          text: "Eraser Mode",
          icon: <EraserIcon />,
          name: CanvasMode.ERASER,
        },
        {
          action: () => {},
          text: "Change Color",
          icon: <Color />,
          name: MenuActions.CHANGE_COLOR,
        },
        {
          action: () => {},
          text: "Change Size",
          icon: <Size />,
          name: MenuActions.CHANGE_SIZE,
        },
        {
          action: () => performAction(MenuActions.ADD_LINE),
          text: "Add Line",
          icon: <Minus />,
          name: MenuActions.ADD_LINE,
        },
        {
          action: () => performAction(MenuActions.ADD_RECTANGLE),
          text: "Add Rectangle",
          icon: <Square />,
          name: MenuActions.ADD_RECTANGLE,
        },
        {
          action: () => performAction(MenuActions.ADD_CIRCLE),
          text: "Add Circle",
          icon: <Circle />,
          name: MenuActions.ADD_CIRCLE,
        },
        {
          action: () => performAction(MenuActions.ADD_TEXT),
          text: "Add Text",
          icon: <Text />,
          name: MenuActions.ADD_TEXT,
        },
      ],
    },
    {
      groupName: "Object Manipulation",
      groupId: MenuGroups.OBJECT_MANIPULATION,
      items: [
        {
          action: () => performAction(MenuActions.CLEAR_CANVAS),
          text: "Clear Canvas",
          icon: <Trash />,
          name: MenuActions.CLEAR_CANVAS,
        },
        {
          action: () => performAction(MenuActions.ADD_IMAGE_URL),
          text: "Add Image from URL",
          icon: <UrlIcon />,
          name: MenuActions.ADD_IMAGE_URL,
        },
        {
          action: () => performAction(MenuActions.ADD_IMAGE_DISK),
          text: "Add Image from disk",
          icon: <ImageIcon />,
          name: MenuActions.ADD_IMAGE_DISK,
        },
      ],
    },
    {
      groupName: "File and Canvas Operations",
      groupId: MenuGroups.FILE_AND_CANVAS_OPERATIONS,
      items: [
        {
          action: () => performAction(MenuActions.EXPORT_PDF),
          text: "Export to PDF",
          icon: <Save />,
          name: MenuActions.EXPORT_PDF,
        },
        {
          action: () => undo(),
          text: "Undo",
          icon: <Undo />,
          name: MenuActions.UNDO,
        },
        {
          action: () => redo(),
          text: "Redo",
          icon: <Redo />,
          name: MenuActions.REDO,
        },
        {
          action: () => performAction(MenuActions.LOAD_CANVAS),

          text: "Load Canvas",
          icon: <Upload />,
          name: MenuActions.LOAD_CANVAS,
        },
        {
          action: () => performAction(MenuActions.SAVE_CANVAS),
          text: "Save Canvas",
          icon: <Save />,
          name: MenuActions.SAVE_CANVAS,
        },
        {
          action: () => performAction(MenuActions.SAVE_IMAGES),
          text: "Save Images",
          icon: <Save />,
          name: MenuActions.SAVE_IMAGES,
        },
        {
          action: () => performAction(MenuActions.LOAD_IMAGES_JSON),
          text: "Load Images from JSON",
          icon: <Upload />,
          name: MenuActions.LOAD_IMAGES_JSON,
        },
        {
          action: () => performAction(MenuActions.GROUP_SELECTED),
          text: "Group Selected Objects",
          icon: <Group />,
          name: MenuActions.GROUP_SELECTED,
        },
        {
          action: () => performAction(MenuActions.REMOVE_SELECTED),
          text: "Remove Selected Objects",
          icon: <Trash />,
          name: MenuActions.REMOVE_SELECTED,
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
