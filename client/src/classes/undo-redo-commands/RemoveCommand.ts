import { FabricObjectIdError } from "@/errors/FabricObjectIdError";
import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { getItemById } from "@/lib/board/canvasUtils";
import { toast } from "sonner";
import { fabric } from "fabric";
import { addListenersBack, removeListenersTemporarily } from "@/lib/board/undoRedoUtils";
import { Socket } from "socket.io-client";
import { AddObjectData, DeleteObjectData } from "@/interfaces/socket/SocketEmitsData";
import { socketEmitAddObject, socketEmitDeleteObject } from "@/lib/board/socketEmitUtils";
import { assignId } from "@/lib/utils";

/**
 * Its purpose is to encompass removing objects DIRECTLY from the canvas.
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

  /**
   *
   * @param canvas The canvas where the object is being removed
   * @param objectJSON The JSON representation of the object that should be removed
   * @throws `FabricObjectIdError` if `objectJSON` does not have an `id`
   */
  constructor(canvas: fabric.Canvas, objectJSON: any) {
    this._objectJSON = objectJSON;
    this._canvas = canvas;

    if (!this._objectJSON._id) {
      throw new FabricObjectIdError(this._objectJSON);
    }
    this._objectId = this._objectJSON._id;
  }

  /**
   * undo
   */
  public undo(socket: Socket) {
    if (getItemById(this._canvas, this._objectId)) {
      toast.warning("The canvas already contains an object with id " + this._objectId);
      return;
    }

    fabric.util.enlivenObjects(
      [this._objectJSON],
      (objects: fabric.Object[]) => {
        objects.forEach((o) => {
          this._canvas.add(o);
          // eslint-disable-next-line
          const { _id, ...objectJSONWithoutId } = this._objectJSON;
          const addObjectData: AddObjectData = { object: objectJSONWithoutId };
          socketEmitAddObject(socket, addObjectData, (res: any) => {
            // we've added back an object to the canvas, so the server generated a new id for it, so we have reassign it
            const newId: string = res._id;
            assignId(o, newId);
            this._objectId = newId;
          });
        });
      },
      "fabric"
    );
  }

  /**
   * redo
   */
  public redo(socket: Socket) {
    // We need to temporarily turn off these handlers, because otherwise we would infinitely create new commands on the stack.
    const activeListeners = removeListenersTemporarily(this._canvas, "path:created");

    const objectToRemove = getItemById(this._canvas, this._objectId);
    if (!objectToRemove) {
      toast.warning("The object with id " + this._objectId + " was not found");
      return;
    }

    this._canvas.remove(objectToRemove);
    this._canvas.requestRenderAll();

    const deleteObjectData: DeleteObjectData = { object: { _id: this._objectId } };
    socketEmitDeleteObject(socket, deleteObjectData);

    addListenersBack(this._canvas, "path:created", activeListeners);
  }
}
