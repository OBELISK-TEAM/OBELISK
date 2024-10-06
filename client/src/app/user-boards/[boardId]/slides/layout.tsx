"use client";

import { SocketProvider } from "@/contexts/SocketContext";
import { SlidesProvider } from "@/contexts/SlidesProvider"

interface UserBoardLayout {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const SliderLayout = ({ children, params }: UserBoardLayout) => {
  const { boardId } = params;

  return <SocketProvider boardId={boardId}>
    <SlidesProvider>
      {children}
    </SlidesProvider>
  </SocketProvider>;
};

export default SliderLayout;
