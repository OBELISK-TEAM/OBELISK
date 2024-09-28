"use client";
import React, { createContext, useContext, useState } from "react";
import { BoardDataResponse } from "@/interfaces/responses/board-data-response";
import { defaultBoardData } from "@/data/default-board-data";

interface BoardDataContextProps {
  boardData: BoardDataResponse;
  setBoardData: (data: BoardDataResponse) => void;
}

const BoardDataContext = createContext<BoardDataContextProps | undefined>(undefined);

export const BoardDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [boardData, setBoardData] = useState<BoardDataResponse>(defaultBoardData);

  return <BoardDataContext.Provider value={{ boardData, setBoardData }}>{children}</BoardDataContext.Provider>;
};

export const useBoardDataContext = () => {
  const context = useContext(BoardDataContext);
  if (!context) {
    throw new Error("useBoardDataContext must be used within a BoardDataProvider");
  }
  return context;
};
