"use client";
import React, { createContext, useContext, useRef, useCallback, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/contexts/CanvasContext";
import { UndoRedoContext as IUndoRedoContext, UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { updateDimensions } from "@/utils/board/canvasUtils";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { generateId } from "@/utils/randomUtils";
import { ModifyCommand } from "@/classes/undo-redo-commands/ModifyCommand";
import { ComplexCommand } from "@/classes/undo-redo-commands/ComplexCommand";

const UndoRedoContext = createContext<IUndoRedoContext | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { canvas },
    handleStyleChange,
  } = useCanvas();

  // these states are used to memorize the content of recently modified text
  // so that we can use this old value to prepare a propper ModifiedCommand
  const [observedTextId, setObservedTextId] = useState<string | undefined>(undefined);
  const [observedTextContent, setObservedTextContent] = useState<string | undefined>(undefined);

  const canvasRef = useRef<fabric.Canvas | null>(canvas);
  const undoStack = useRef<Array<UndoRedoCommand>>([]);
  const redoStack = useRef<Array<UndoRedoCommand>>([]);

  useEffect(() => {
    canvasRef.current = canvas;
  }, [canvas]);

  const saveCommand = useCallback((command: UndoRedoCommand) => {
    undoStack.current.push(command);
    if (undoStack.current.length > 50) {
      undoStack.current.shift();
    }
    redoStack.current.length = 0;
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || undoStack.current.length === 0) {
      return;
    }
    const lastAction = undoStack.current.pop();
    if (!lastAction) {
      return;
    }

    lastAction.undo();
    redoStack.current.push(lastAction);
    canvas.renderAll();
  }, []);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || redoStack.current.length === 0) {
      return;
    }
    const lastAction = redoStack.current.pop();
    if (!lastAction) {
      return;
    }

    lastAction.redo();
    undoStack.current.push(lastAction);
    canvas.renderAll();
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handlePathCreated = (e: any) => {
      if (!e.path) {
        return;
      }

      if (!canvas.contains(e.path)) {
        return;
      } // to differentiate betwen 'real paths' and 'eraser paths'

      const id = generateId("path");
      Object.assign(e.path, { id });

      const command = new AddCommand(canvas, e.path.toJSON(["id"]));
      saveCommand(command);
    };

    /**
     * This handler handles oly those modifications, which are visible in the `fabric.IEvent#transform.original` object
     * (like angle, scaleX, top, left etc.) (not like color, strokeWidth etc.)
     */
    const handleObjectModified = (e: fabric.IEvent) => {
      const oldValues = e.transform?.original; // the original properties values before modification
      const modifiedObject = e.target;

      if (!oldValues || !modifiedObject) {
        return;
      }

      modifiedObject.clone(
        (clonedObject: fabric.Object) => {
          // prepare version from before modification
          type Key = keyof typeof oldValues;
          (Object.keys(oldValues) as Key[]).forEach((key) => {
            clonedObject.set(key, oldValues[key]);
          });

          const command = new ModifyCommand(
            canvas,
            clonedObject.toJSON(["id"]),
            modifiedObject.toJSON(["id"]),
            handleStyleChange
          );
          saveCommand(command);
        },
        ["id"]
      );

      updateDimensions(modifiedObject);
      handleStyleChange();
    };

    const handleEraserAdded = (e: any) => {
      if (!e.targets) {
        return;
      } // the erased path doesn't collide with enything erasable

      const commands: UndoRedoCommand[] = [];
      for (const target of e.targets) {
        target.clone(
          // http://fabricjs.com/docs/fabric.Object.html#clone
          (clonedObject: any) => {
            clonedObject.eraser._objects.pop();
            if (!clonedObject.eraser._objects) {
              delete clonedObject.eraser;
            }

            const modifyCommand = new ModifyCommand(canvas, clonedObject, target, handleStyleChange);
            commands.push(modifyCommand);
          },
          ["id"]
        );

        saveCommand(new ComplexCommand(commands));
      }
    };

    const handleTextEditingEntered = (e: any) => {
      setObservedTextId(e.target.id);
      setObservedTextContent(e.target.text);
    };

    const handleTextEditingExited = (e: any) => {
      const currentId: string = e.target.id;
      if (currentId !== observedTextId) {
        // that's not the same object
        return;
      }

      const currentText: string = e.target.text;
      if (currentText === observedTextContent) {
        // text content hasn't changed
        return;
      }

      e.target.clone(
        (clonedObject: fabric.Text) => {
          clonedObject.text = observedTextContent; // prepare the old version
          const command = new ModifyCommand(
            canvas,
            clonedObject.toJSON(["id"]),
            e.target.toJSON(["id"]),
            handleStyleChange
          );
          saveCommand(command);
        },
        ["id"]
      );

      setObservedTextContent(currentText);
    };

    canvas.on("path:created", handlePathCreated);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("erasing:end", handleEraserAdded);
    canvas.on("text:editing:entered", handleTextEditingEntered);
    canvas.on("text:editing:exited", handleTextEditingExited);

    return () => {
      canvas.off("path:created", handlePathCreated);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("erasing:end", handleEraserAdded);
      canvas.off("text:editing:entered", handleTextEditingEntered);
      canvas.off("text:editing:exited", handleTextEditingExited);
    };
  }, [canvas, saveCommand, handleStyleChange, observedTextContent, observedTextId]);

  return <UndoRedoContext.Provider value={{ saveCommand, undo, redo }}>{children}</UndoRedoContext.Provider>;
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useUndoRedo must be used within an UndoRedoProvider");
  }
  return context;
};
