import { FabricObjectIdError } from "@/errors/FabricObjectIdError";
import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { getItemById } from "@/utils/board/canvasUtils";
import { toast } from "sonner";
import { fabric } from "fabric";

/**
 * Its purpose it to encompass adding/removing objects DIRECTLY to/from the canvas.
 * The class doesn't handle the 'object nested in another object' situation.
 */
export class RemoveCommand implements UndoRedoCommand {
  private _objectId: string;
  public get id(): string {
    return this._objectId;
  }

  private _objectJSON: any;
  public get objectJSON(): any {
    return this._objectJSON;
  }

  private _canvas: fabric.Canvas;
  public get canvas(): fabric.Canvas {
    return this._canvas;
  }

  constructor(canvas: fabric.Canvas, object: fabric.Object) {
    this._objectJSON = object.toJSON(["id"]);
    this._canvas = canvas;

    if (!this._objectJSON.id) throw new FabricObjectIdError(object);
    this._objectId = this._objectJSON.id;
  }

  /**
   * undo
   */
  public undo() {
    if (getItemById(this._canvas, this._objectId)) {
      toast.warning("The canvas already contains an object with id " + this._objectId);
      return;
    }

    fabric.util.enlivenObjects(
      [this._objectJSON],
      (objects: any[]) => {
        var origRenderOnAddRemove = this._canvas.renderOnAddRemove;
        this._canvas.renderOnAddRemove = false;

        objects.forEach((o) => {
          this._canvas.add(o);
        });

        this._canvas.renderOnAddRemove = origRenderOnAddRemove;
        this._canvas.renderAll();
      },
      "fabric"
    );
  }

  /**
   * redo
   */
  public redo() {
    // we need to temporarily turn off these handlers, because otherwise we would infinitely create new commands on the stack
    // @ts-ignore
    const activeHandlers = this._canvas.__eventListeners["path:created"]; // TODO: refactor it out into a util function I guess
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
}
