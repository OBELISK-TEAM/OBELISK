import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { getItemById } from "@/utils/board/canvasUtils";
import { toast } from "sonner";

/**
 * The class is used in the canvas undo/redo functionality.
 * Its purpose it to encompass adding/removing objects DIRECTLY to/from the canvas.
 * The class doesn't handle the 'object nested in another object' situation.
 */
export class AddCommand implements UndoRedoCommand {
  private _objectId: string;
  public get id(): string {
    return this._objectId;
  }

  private _object: fabric.Object;
  public get object(): fabric.Object {
    return this._object;
  }

  private _canvas: fabric.Canvas;
  public get canvas(): fabric.Canvas {
    return this._canvas;
  }

  constructor(canvas: fabric.Canvas, id: string, object: fabric.Object) {
    this._objectId = id;
    this._object = object;
    this._canvas = canvas;
  }

  /**
   * undo
   */
  public undo() {
    // we need to temporarily turn off these handlers, because otherwise we would infinitely create new commands on the stack
    // @ts-ignore
    const activeHandlers = this._canvas.__eventListeners["path:created"];
    // @ts-ignore
    this._canvas.__eventListeners["path:created"] = [];

    const objectToRemove = getItemById(this._canvas, this._objectId);
    if (!objectToRemove) {
      toast.warning("The object with id " + this._objectId + " was not found");
      return;
    }

    this._canvas.remove(objectToRemove);
    this.canvas.renderAll();

    // @ts-ignore
    this._canvas.__eventListeners["path:created"] = activeHandlers;
  }

  /**
   * redo
   */
  public redo() {
    if (getItemById(this._canvas, this._objectId)) {
      toast.warning("The canvas already contains an object with id " + this._objectId);
      return;
    }

    this.canvas.add(this._object);
    this.canvas.renderAll();
  }
}
