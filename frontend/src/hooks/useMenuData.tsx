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
          name: "drawing-mode",
        },
        {
          action: () => {},
          text: "Change Color",
          icon: <Color />,
          name: "change-color",
        },
        {
          action: () => {},
          text: "Change Size",
          icon: <Size />,
          name: "change-size",
        },
        {
          text: "Add Line",
          icon: <Minus />,
          name: "add-line",
          action: () => performAction("add-line"),
        },
        {
          text: "Add Rectangle",
          icon: <Square />,
          name: "add-rectangle",
          action: () => performAction("add-rectangle"),
        },
        {
          text: "Add Circle",
          icon: <Circle />,
          name: "add-circle",
          action: () => performAction("add-circle"),
        },
        {
          text: "Add Text",
          icon: <Text />,
          name: "add-text",
          action: () => performAction("add-text"),
        },
      ],
    },
    {
      group: "Object Manipulation",
      items: [
        {
          action: () => performAction("clear-canvas"),
          text: "Clear Canvas",
          icon: <Trash />,
          name: "clear-canvas",
        },
        {
          text: "Add Image from URL",
          icon: <UrlIcon />,
          name: "add-image-url",
          action: () => performAction("add-image-url"),
        },
        {
          text: "Add Image from disk",
          icon: <ImageIcon />,
          name: "add-image-disk",
          action: () => performAction("add-image-disk"),
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
          name: "export-pdf",
        },
        {
          text: "Undo",
          icon: <Undo />,
          action: (e?: any) => {
            e?.preventDefault();
            undo();
          },
          name: "undo",
        },
        {
          text: "Redo",
          icon: <Redo />,
          action: (e?: any) => {
            e?.preventDefault();
            redo();
          },
          name: "redo",
        },
        {
          action: () => performAction("load-canvas"),
          text: "Load Canvas",
          icon: <Upload />,
          name: "load-canvas",
        },
        {
          action: () => handleSave(canvas),
          text: "Save Canvas",
          icon: <Save />,
          name: "save-canvas",
        },
        {
          action: () => handleSaveImages(),
          text: "Save Images",
          icon: <Save />,
          name: "save-images",
        },
        {
          action: () => performAction("load-images-json"),
          text: "Load Images from JSON",
          icon: <Upload />,
          name: "load-images-json",
        },
        {
          action: () => performAction("group-selected"),
          text: "Group Selected",
          icon: <Group />,
          name: "group-selected",
        },
        {
          action: () => performAction("remove-selected"),
          text: "Remove Selected",
          icon: <Trash />,
          name: "remove-selected",
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
