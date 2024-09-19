import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { getItemById } from "@/utils/board/canvasUtils";
import { toast } from "sonner";
import { FabricObjectIdError } from "@/errors/FabricObjectIdError";
import { fabric } from "fabric";
import { addListenersBack, removeListenersTemporarily } from "@/utils/board/undoRedoUtils";

/**
 * The purpose of this class is to encompass adding/removing objects DIRECTLY to/from the canvas.
 * The class doesn't handle the 'object nested in another object' situation.
 */
export class AddCommand implements UndoRedoCommand {
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

  /**
   *
   * @param canvas
   * @param id
   * @param object It **has to** have an `id` property already set
   * @throws `FabricObjectIdError` if `object` has no `id` property
   */
  constructor(canvas: fabric.Canvas, object: fabric.Object) {
    this._objectJSON = object.toJSON(["id"]);
    this._canvas = canvas;

    if (!this._objectJSON.id) {
      throw new FabricObjectIdError(object);
    }
    this._objectId = this._objectJSON.id;
  }

  /**
   * undo
   */
  public undo() {
    const objectToRemove = getItemById(this._canvas, this._objectId);
    if (!objectToRemove) {
      toast.warning("The object with id " + this._objectId + " was not found");
      return;
    }

    this._canvas.remove(objectToRemove);
    this.canvas.renderAll();
  }

  /**
   * redo
   */
  public redo() {
    // We need to temporarily turn off these handlers, because otherwise we would infinitely create new commands on the stack.
    const activeListeners = removeListenersTemporarily(this.canvas, "path:created");

    if (getItemById(this._canvas, this._objectId)) {
      toast.warning("The canvas already contains an object with id " + this._objectId);
      return;
    }

    fabric.util.enlivenObjects(
      [this._objectJSON],
      (objects: fabric.Object[]) => {
        objects.forEach((o) => {
          this._canvas.add(o);
        });
      },
      "fabric"
    );

    addListenersBack(this.canvas, "path:created", activeListeners);
  }
}
