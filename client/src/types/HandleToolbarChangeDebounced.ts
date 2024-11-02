import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { ModifyCommand } from "@/classes/undo-redo-commands/ModifyCommand";

export type HandleToolbarChangeDebounced = (
  key: string,
  modifiedObject: fabric.Object,
  oldValue: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  canvas: fabric.Canvas,
  saveCommand: (command: ModifyCommand) => void
) => void;
