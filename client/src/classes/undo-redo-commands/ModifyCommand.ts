import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { getItemById, updateDimensions } from "@/lib/board/canvasUtils";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import { UpdateObjectData } from "@/interfaces/socket/SocketEmitsData";
import { socketEmitUpdateObject } from "@/lib/board/socketEmitUtils";
import { addListenersBack, removeListenersTemporarily } from "@/lib/board/undoRedoUtils";
import { fabric } from "fabric";
import { assignId } from "@/lib/utils";

/**
 * The class is used in the canvas undo/redo functionality.
 * It should be used to memorize changes of the modified object and undo/redo these changes.
 * The idea is simple: store two objects: an old one and a new one. Add them or remove them from canvas as needed.
 */
export class ModifyCommand implements UndoRedoCommand {
  private _canvas: fabric.Canvas;
  public get canvas(): fabric.Canvas {
    return this._canvas;
  }

  private _objectId: string;
  public get objectId(): string {
    return this._objectId;
  }

  private _objectBefore: any;
  public get objectBefore(): any {
    return this._objectBefore;
  }

  private _objectAfter: any;
  public get objectAfter(): any {
    return this._objectAfter;
  }

  private _handleStyleChange: () => void;
  public get handleStyleChange(): () => void {
    return this._handleStyleChange;
  }

  /**
   *
   * @param canvas The canvas where objects are added/removed
   * @param objectBefore JSON representation of the object before modification
   * @param objectAfter JSON representation of the object after modification
   * @param handleStyleChange A callback for handling style changes
   * @throws `FabricObjectIdError` if `objectBefore` or `objectAfter` does not have an `id`
   * @throws Error if `objectBefore._id` and `objectAfter._id` do not match
   */
  constructor(canvas: fabric.Canvas, objectBefore: any, objectAfter: any, id: string, handleStyleChange: () => void) {
    this._canvas = canvas;
    this._handleStyleChange = handleStyleChange;

    if (!id) {
      throw new Error("Id has to be defined");
    }
    if (objectBefore._id !== objectAfter._id) {
      throw new Error("Ids of objectBefore and objectAfter are not the same");
    }
    // eslint-disable-next-line
    const { _id: trash1, ...objectBeforeWithoutId } = objectBefore;
    this._objectBefore = objectBeforeWithoutId;
    // eslint-disable-next-line
    const { _id: trash2, ...objectAfterWithoutId } = objectAfter;
    this._objectAfter = objectAfterWithoutId;
    this._objectId = id;
  }

  /**
   * undo
   */
  public undo(socket: Socket) {
    const activeListeners = removeListenersTemporarily(this._canvas, "path:created");

    const objectToModify = getItemById(this._canvas, this._objectId);
    if (!objectToModify) {
      toast.warning("The object with id " + this._objectId + " was not found");
      return;
    }

    this._canvas.remove(objectToModify);
    this._canvas.requestRenderAll();

    fabric.util.enlivenObjects(
      [this._objectBefore],
      (objects: fabric.Object[]) => {
        objects.forEach((o) => {
          assignId(o, this._objectId);
          this._canvas.add(o);
          updateDimensions(o); // Update dimensions in case scaleX/scaleY changed
          this._handleStyleChange();
        });
      },
      "fabric"
    );

    const objectBeforeWithId = { _id: this._objectId, ...this._objectBefore };
    const updateObjectData: UpdateObjectData = { object: objectBeforeWithId };
    socketEmitUpdateObject(socket, updateObjectData);

    this._handleStyleChange();

    addListenersBack(this._canvas, "path:created", activeListeners);
  }

  /**
   * redo
   */
  public redo(socket: Socket) {
    // this._addObjectBefore.undo(socket);
    // this._addObjectAfter.redo(socket);

    const activeListeners = removeListenersTemporarily(this._canvas, "path:created");

    const objectToModify = getItemById(this._canvas, this._objectId);
    if (!objectToModify) {
      toast.warning("The object with id " + this._objectId + " was not found");
      return;
    }

    this._canvas.remove(objectToModify);
    this._canvas.requestRenderAll();

    fabric.util.enlivenObjects(
      [this._objectAfter],
      (objects: fabric.Object[]) => {
        objects.forEach((o) => {
          assignId(o, this._objectId);
          this._canvas.add(o);
          updateDimensions(o); // Update dimensions in case scaleX/scaleY changed
          this._handleStyleChange();
        });
      },
      "fabric"
    );

    const objectAfterWithId = { _id: this._objectId, ...this._objectAfter };
    const updateObjectData: UpdateObjectData = { object: objectAfterWithId };
    socketEmitUpdateObject(socket, updateObjectData);

    addListenersBack(this._canvas, "path:created", activeListeners);

    // Please, don't remove it. I have a hunch it will be useful in the future
    //   if (this._objectAfter.type !== "image" && !currentObject) {
    //     // adding images to canvas takes time, so they aren't available immediately
    //     toast.warning("The object with id " + this._objectId + " was not found");
    //     return;
    //   }
  }
}
