import { FabricObjectIdError } from "@/errors/FabricObjectIdError";
import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { getItemById, updateDimensions } from "@/utils/board/canvasUtils";
import { AddCommand } from "./AddCommand";
import { toast } from "sonner";

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

  private _addObjectBefore: AddCommand;
  public get addObjectBefore(): AddCommand {
    return this._addObjectBefore;
  }

  private _addObjectAfter: AddCommand;
  public get addObjectAfter(): AddCommand {
    return this._addObjectAfter;
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
  constructor(canvas: fabric.Canvas, objectBefore: any, objectAfter: any, handleStyleChange: () => void) {
    this._canvas = canvas;
    this._handleStyleChange = handleStyleChange;

    if (!objectBefore._id) {
      throw new FabricObjectIdError(objectBefore);
    }
    if (!objectAfter._id) {
      throw new FabricObjectIdError(objectAfter);
    }
    if (objectBefore._id !== objectAfter._id) {
      throw new Error("Ids of objectBefore and objectAfter are not the same");
    }

    this._addObjectBefore = new AddCommand(canvas, objectBefore);
    this._addObjectAfter = new AddCommand(canvas, objectAfter);

    this._objectId = objectBefore._id;
  }

  /**
   * undo
   */
  public undo() {
    this._addObjectAfter.undo();
    this._addObjectBefore.redo();

    this._handleStyleChange();
  }

  /**
   * redo
   */
  public redo() {
    this._addObjectBefore.undo();
    this._addObjectAfter.redo();

    const currentObject = getItemById(this._canvas, this._objectId);

    if (this._addObjectAfter.objectJSON.type !== "image" && !currentObject) {
      // adding images to canvas takes time, so they aren't available immediately
      toast.warning("The object with id " + this._objectId + " was not found");
      return;
    }

    updateDimensions(currentObject); // Update dimensions in case scaleX/scaleY changed
    this._handleStyleChange();
  }
}
