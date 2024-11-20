import { SocketProvider } from "@/contexts/SocketContext";
import { getCookie } from "@/lib/authApiUtils";

interface UserBoardLayout {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}

const SliderLayout = ({ children, params }: UserBoardLayout) => {
  const { boardId } = params;
  const token = getCookie("accessToken");
  return (
    <SocketProvider token={token} boardId={boardId}>
      {children}
    </SocketProvider>
  );
};

export default SliderLayout;
