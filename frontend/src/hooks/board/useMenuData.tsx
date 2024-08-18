import useCanvasMode from "@/hooks/board/useCanvasMode";
import useColorAndSize from "@/hooks/board/useColorAndSize";
import useUndoRedo from "@/hooks/board/useUndoRedo";
import useCanvasEventHandlers from "@/hooks/board/useCanvasEventHandlers";
import useFileHandling from "@/hooks/board/useFileHandling";
import useMenuActions from "@/hooks/board/useMenuActions";
import { exportToPDF, handleSave } from "@/utils/fabricCanvasUtils";
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
import useKeydownListener from "./useKeydownListener";
import { MenuAction } from "@/enums/MenuActions";
import { PencilBrush } from "fabric/fabric-impl";
import { CanvasMode } from "@/enums/CanvasMode";

const useMenuData = (canvas: fabric.Canvas | null) => {
  const { canvasMode, setCanvasMode } = useCanvasMode(canvas);
  const { color, size, setColor, setSize } = useColorAndSize(canvas);
  const { saveState, undo, redo } = useUndoRedo(canvas);
  useCanvasEventHandlers(canvas, saveState);
  const { handleLoadImagesFromJson, handleFileChange, handleAddImageByUrl, handleSaveImages } = useFileHandling(
    canvas,
    saveState
  );
  const performAction = useMenuActions(canvas, color, size, saveState, setCanvasMode);
  useKeydownListener(canvas, performAction, undo, redo);

  const menuList: MenuGroup[] = [
    {
      group: "Drawing Tools",
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
    canvasMode,
    setColor,
    setSize,
  };
};

export default useMenuData;
