import { FabricObjectIdError } from "@/errors/FabricObjectIdError";
import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { getItemById, updateDimensions } from "@/utils/board/canvasUtils";
import { AddCommand } from "./AddCommand";

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

  constructor(
    canvas: fabric.Canvas,
    objectBefore: fabric.Object,
    objectAfter: fabric.Object,
    handleStyleChange: () => void
  ) {
    this._canvas = canvas;
    this._handleStyleChange = handleStyleChange;

    if (!Object.hasOwn(objectBefore, "id")) throw new FabricObjectIdError(objectBefore);
    if (!Object.hasOwn(objectAfter, "id")) throw new FabricObjectIdError(objectAfter);
    // @ts-ignore
    if (objectBefore.id !== objectAfter.id) throw new Error("Ids of objectBefore and objectAfter are not the same");

    this._addObjectBefore = new AddCommand(canvas, objectBefore);
    this._addObjectAfter = new AddCommand(canvas, objectAfter);

    // @ts-ignore
    this._objectId = objectBefore.id;
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

    updateDimensions(currentObject); // needed in case the modification changed scaleX and/or scaleY properties
    this._handleStyleChange();
  }
}
