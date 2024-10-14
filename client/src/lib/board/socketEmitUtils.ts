import {
  AddObjectData,
  AddSlideData,
  DeleteObjectData,
  DeleteSlideData,
  JoinBoardData,
  JoinSlideData,
  LeaveBoardData,
  LeaveSlideData,
  UpdateObjectData,
} from "@/interfaces/socket/SocketEmitsData";
import { Socket } from "socket.io-client";

// Utility function to handle optional callbacks
const emitWithCallback = (socket: Socket, event: string, data: any, callback?: (res: any) => void) => {
  if (callback) {
    socket.emit(event, data, callback);
  } else {
    socket.emit(event, data);
  }
};

// BOARD //
export const socketEmitJoinBoard = (socket: Socket, joinBoardData: JoinBoardData, callback?: (res: any) => void) => {
  emitWithCallback(socket, "join-board", joinBoardData, callback);
};

export const socketEmitLeaveBoard = (socket: Socket, leaveBoardData: LeaveBoardData, callback?: (res: any) => void) => {
  emitWithCallback(socket, "leave-board", leaveBoardData, callback);
};

// SLIDES //
export const socketEmitAddSlide = (socket: Socket, addSlideData: AddSlideData, callback?: (res: any) => void) => {
  emitWithCallback(socket, "add-slide", addSlideData, callback);
};

export const socketEmitDeleteSlide = (
  socket: Socket,
  deleteSlideData: DeleteSlideData,
  callback?: (res: any) => void
) => {
  emitWithCallback(socket, "delete-slide", deleteSlideData, callback);
};

export const socketEmitNotifyLastSlideDeleted = (
  socket: Socket,
  deleteSlideData: DeleteSlideData,
  callback?: (res: any) => void
) => {
  emitWithCallback(socket, "slide-deleted", deleteSlideData, callback);
};

export const socketEmitJoinSlide = (socket: Socket, joinSlideData: JoinSlideData, callback?: (res: any) => void) => {
  emitWithCallback(socket, "join-slide", joinSlideData, callback);
};

export const socketEmitLeaveSlide = (socket: Socket, leaveSlideData: LeaveSlideData, callback?: (res: any) => void) => {
  emitWithCallback(socket, "leave-slide", leaveSlideData, callback);
};

// OBJECTS //
export const socketEmitAddObject = (socket: Socket, addObjectData: AddObjectData, callback?: (res: string) => void) => {
  emitWithCallback(socket, "add-object", addObjectData, callback);
};

export const socketEmitUpdateObject = (
  socket: Socket,
  updateObjectData: UpdateObjectData,
  callback?: (res: string) => void
) => {
  emitWithCallback(socket, "update-object", updateObjectData, callback);
};

export const socketEmitDeleteObject = (
  socket: Socket,
  deleteObjectData: DeleteObjectData,
  callback?: (res: string) => void
) => {
  emitWithCallback(socket, "delete-object", deleteObjectData, callback);
};
