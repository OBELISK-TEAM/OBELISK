import useDrawingMode from "@/hooks/useDrawingMode";
import useColorAndSize from "@/hooks/useColorAndSize";
import useUndoRedo from "@/hooks/useUndoRedo";
import useCanvasEventHandlers from "@/hooks/useCanvasEventHandlers";
import useFileHandling from "@/hooks/useFileHandling";
import useMenuActions from "@/hooks/useMenuActions";
import { exportToPDF, handleSave } from "@/lib/fabricCanvasUtils";
import { MenuGroup } from "@/interfaces/canva-interfaces";
import {
  Pencil,
  MousePointer,
  Square,
  Save,
  Upload,
  Trash,
  Text,
  Group,
  Circle,
  Link as UrlIcon,
  ImageIcon,
  Palette as Color,
  Scale3D as Size,
  Redo,
  Minus,
  Undo,
} from "lucide-react";
import useKeydownListener from "./useKeydownListener";
import {MenuAction} from "@/enums/MenuActions";
const useMenuData = (canvas: fabric.Canvas | null) => {
  const { isDrawingMode, setIsDrawingMode } = useDrawingMode(canvas);
  const { color, size, setColor, setSize } = useColorAndSize(canvas);
  const { saveState, undo, redo } = useUndoRedo(canvas);
  useCanvasEventHandlers(canvas, saveState);
  const {
    handleLoadImagesFromJson,
    handleFileChange,
    handleAddImageByUrl,
    handleSaveImages,
  } = useFileHandling(canvas, saveState);
  const performAction = useMenuActions(
    canvas,
    color,
    size,
    saveState,
    setIsDrawingMode
  );
  useKeydownListener(canvas, performAction, undo, redo);
  const menuList: MenuGroup[] = [
    {
      group: "Drawing Tools",
      items: [
        {
          action: () => setIsDrawingMode(!isDrawingMode),
          text: isDrawingMode ? "Turn Selection Mode" : "Turn Drawing Mode",
          icon: isDrawingMode ? <MousePointer /> : <Pencil />,
          name: MenuAction.DrawingMode,
        },
        {
          action: () => {},
          text: "Change Color",
          icon: <Color />,
          name: MenuAction.ChangeColor,
        },
        {
          action: () => {},
          text: "Change Size",
          icon: <Size />,
          name: MenuAction.ChangeSize,
        },
        {
          text: "Add Line",
          icon: <Minus />,
          name: MenuAction.AddLine,
          action: () => performAction(MenuAction.AddLine),
        },
        {
          text: "Add Rectangle",
          icon: <Square />,
          name: MenuAction.AddRectangle,
          action: () => performAction(MenuAction.AddRectangle),
        },
        {
          text: "Add Circle",
          icon: <Circle />,
          name: MenuAction.AddCircle,
          action: () => performAction(MenuAction.AddCircle),
        },
        {
          text: "Add Text",
          icon: <Text />,
          name: MenuAction.AddText,
          action: () => performAction(MenuAction.AddText),
        },
      ],
    },
    {
      group: "Object Manipulation",
      items: [
        {
          action: () => performAction(MenuAction.ClearCanvas),
          text: "Clear Canvas",
          icon: <Trash />,
          name: MenuAction.ClearCanvas,
        },
        {
          text: "Add Image from URL",
          icon: <UrlIcon />,
          name: MenuAction.AddImageUrl,
          action: () => performAction(MenuAction.AddImageUrl),
        },
        {
          text: "Add Image from disk",
          icon: <ImageIcon />,
          name: MenuAction.AddImageDisk,
          action: () => performAction(MenuAction.AddImageDisk),
        },
      ],
    },
    {
      group: "File and Canvas Operations",
      items: [
        {
          action: () => exportToPDF(canvas),
          text: "Export to PDF",
          icon: <Save />,
          name: MenuAction.ExportPdf,
        },
        {
          text: "Undo",
          icon: <Undo />,
          action: (e?: any) => {
            e?.preventDefault();
            undo();
          },
          name: MenuAction.Undo,
        },
        {
          text: "Redo",
          icon: <Redo />,
          action: (e?: any) => {
            e?.preventDefault();
            redo();
          },
          name: MenuAction.Redo,
        },
        {
          action: () => performAction(MenuAction.LoadCanvas),
          text: "Load Canvas",
          icon: <Upload />,
          name: MenuAction.LoadCanvas,
        },
        {
          action: () => handleSave(canvas),
          text: "Save Canvas",
          icon: <Save />,
          name: MenuAction.SaveCanvas,
        },
        {
          action: () => handleSaveImages(),
          text: "Save Images",
          icon: <Save />,
          name: MenuAction.SaveImages,
        },
        {
          action: () => performAction(MenuAction.LoadImagesJson),
          text: "Load Images from JSON",
          icon: <Upload />,
          name: MenuAction.LoadImagesJson,
        },
        {
          action: () => performAction(MenuAction.GroupSelected),
          text: "Group Selected Objects",
          icon: <Group />,
          name: MenuAction.GroupSelected,
        },
        {
          action: () => performAction(MenuAction.RemoveSelected),
          text: "Remove Selected Objects",
          icon: <Trash />,
          name: MenuAction.RemoveSelected,
        },
      ],
    },
  ];


  return {
    menuList,
    handleAddImageByUrl,
    handleFileChange,
    handleLoadImagesFromJson,
    color,
    size,
    setColor,
    setSize,
  };
};

export default useMenuData;
