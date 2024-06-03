
/* IMPORTANT: Please retain this file. It serves as a critical fallback in case of future issues or bugs. */


import { useState, useEffect, useRef, useCallback } from "react";
import { MenuGroup, DropDownMenuItem } from "@/interfaces/canva-interfaces";
import {
  Pencil,
  MousePointer,
  Square,
  Save,
  Upload,
  Trash,
  Text,
  File,
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
import {
  handleGroupSelected,
  handleRemoveSelected,
  exportToPDF,
  handleLoadFromJSON,
  handleSave,
  addLine,
  addRectangle,
  addCircle,
  handleAddText,
  addImage,
  resizeImage,
  saveImagesToLocalFile,
  loadImagesFromJSON,
  toggleDrawingMode,
} from "@/lib/fabricCanvasUtils";

const useMenuData = (canvas: fabric.Canvas | null) => {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const defaultFontSize = 20;

  const undoStack = useRef<Array<any>>([]);
  const redoStack = useRef<Array<any>>([]);

  const areStatesEqual = (state1: any, state2: any) => {
    return JSON.stringify(state1) === JSON.stringify(state2);
  };

  const saveState = useCallback(
    (canvas: fabric.Canvas | null) => {
      if (canvas) {
        const state = canvas.toJSON();
        if (
          undoStack.current.length === 0 ||
          !areStatesEqual(
            state,
            undoStack.current[undoStack.current.length - 1]
          )
        ) {
          undoStack.current.push(state);
          if (undoStack.current.length > 50) {
            undoStack.current.shift(); // Limit the stack size to 50 states
          }
          redoStack.current.length = 0; // Clear the redo stack
        }
      }
      //console.log(undoStack.current, redoStack.current);
    },
    [undoStack, redoStack]
  );

  const undo = (canvas: fabric.Canvas | null) => {
    if (undoStack.current.length > 0) {
      const currentState = canvas?.toJSON();
      if (currentState) {
        redoStack.current.push(currentState);

        const state = undoStack.current.pop();
        if (state) {
          canvas?.loadFromJSON(state, () => {
            canvas.renderAll();
            canvas.calcOffset();
          });
        }
      }
    }
  };

  const redo = (canvas: fabric.Canvas | null) => {
    if (redoStack.current.length > 0) {
      const currentState = canvas?.toJSON();
      if (currentState) {
        undoStack.current.push(currentState);

        const state = redoStack.current.pop();
        if (state) {
          canvas?.loadFromJSON(state, () => {
            canvas.renderAll();
            canvas.calcOffset();
          });
        }
      }
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = size;
      toggleDrawingMode(canvas, isDrawingMode);

      const handleMouseDown = () => {
        saveState(canvas);
      };

      const handleMouseUp = () => {
        saveState(canvas);
      };

      const handlePathCreated = () => {
        saveState(canvas);
      };
      const handleMouseWheel = (opt: any) => {
        const evt = opt.e;
        if (canvas) {
          const delta = evt.deltaY;
          let zoom = canvas.getZoom();
          zoom *= 0.999 ** delta;
          if (zoom > 20) zoom = 20;
          if (zoom < 0.01) zoom = 0.01;
          canvas.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom);
          evt.preventDefault();
          evt.stopPropagation();
        }
      };

      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:up", handleMouseUp);
      canvas.on("path:created", handlePathCreated);
      canvas.on("mouse:wheel", handleMouseWheel);

      return () => {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:up", handleMouseUp);
        canvas.off("path:created", handlePathCreated);
        canvas.off("mouse:wheel", handleMouseWheel);
      };
    }
  }, [isDrawingMode, color, size, canvas, saveState]);

  
  const handleLoadImagesFromJson = useCallback((
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          loadImagesFromJSON(canvas, result as string);
          saveState(canvas);
        }
      };
      reader.readAsText(file);
    }
  },[canvas, saveState]);

  const performAction = useCallback((name: string) => {
    const properties = {
      color,
      strokeWidth: size,
      fillColor: color,
      fontSize: defaultFontSize,
      width: size * 10,
      height: size * 5,
      radius: size * 5,
    };
    if (name) {
      switch (name) {
        case "add-line":
          addLine(canvas, properties);
          setIsDrawingMode(false);
          break;
        case "add-rectangle":
          addRectangle(canvas, properties);
          setIsDrawingMode(false);
          break;
        case "add-circle":
          addCircle(canvas, properties);
          setIsDrawingMode(false);
          break;
        case "add-text":
          handleAddText(canvas, 50, 50, properties);
          setIsDrawingMode(false);
          break;
        case "group-selected":
          handleGroupSelected(canvas);
          break;
        case "remove-selected":
          handleRemoveSelected(canvas);
          break;
        case "clear-canvas":
          canvas?.clear();
          break;
        case "load-canvas":
          handleLoadFromJSON(canvas);
          break;
        case "load-images-json":
          handleLoadImagesFromJson;
          break;
        default:
          break;
      }
      saveState(canvas);
    }
  },[canvas, color, size, saveState, handleLoadImagesFromJson]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case "z":
            undo(canvas);
            break;
          case "y":
            redo(canvas);
            break;
          case "Z":
            if (event.shiftKey) {
              redo(canvas);
            }
            break;
          default:
            break;
        }
      } else if (event.key === "Backspace" || event.key === "Delete") {
        performAction("remove-selected");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas, performAction]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          resizeImage(result as string, 800, 600, (resizedImage) => {
            addImage(canvas, resizedImage);
            saveState(canvas);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(Number(event.target.value));
  };

  const handleAddImageByUrl = (url: string) => {
    if (canvas) {
      addImage(canvas, url);
      saveState(canvas);
    }
  };

  const handleSaveImages = () => {
    saveImagesToLocalFile(canvas);
    saveState(canvas);
  };

  

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
          action: () => handleColorChange,
          text: "Change Color",
          icon: <Color />,
          name: "change-color",
        },
        {
          action: () => handleSizeChange,
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
          action: () => {},
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
          action: () => undo(canvas),
          name: "undo",
        },
        {
          text: "Redo",
          icon: <Redo />,
          action: () => redo(canvas),
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
    handleColorChange,
    handleSizeChange,
  };
};

export default useMenuData;
