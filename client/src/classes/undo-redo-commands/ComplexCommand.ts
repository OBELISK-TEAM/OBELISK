import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { Socket } from "socket.io-client";

/**
 * The class is used in the canvas undo/redo functionality.
 * It is used to aggregate multiple objects of UndoRedoCommand into one such a command.
 *
 * @param commands an array of commands to perform. They should be in the same order as they should be performed during the **redo** method.
 */
export class ComplexCommand implements UndoRedoCommand {
  private _commands: UndoRedoCommand[];
  public get commands(): UndoRedoCommand[] {
    return this._commands;
  }

  constructor(commands: UndoRedoCommand[]) {
    this._commands = commands;
  }

  /**
   * undo
   */
  public undo(socket: Socket) {
    for (const command of this._commands.toReversed()) {
      command.undo(socket);
    }
  }

  /**
   * redo
   */
  public redo(socket: Socket) {
    for (const command of this._commands) {
      command.redo(socket);
    }
  }
}
