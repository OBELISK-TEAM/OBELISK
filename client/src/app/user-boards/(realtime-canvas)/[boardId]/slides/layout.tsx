import { SocketProvider } from "@/contexts/SocketContext";

interface UserBoardLayout {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const SliderLayout = ({ children, params }: UserBoardLayout) => {
  const { boardId } = params;

  return <SocketProvider boardId={boardId}>{children}</SocketProvider>;
};

export default SliderLayout;
