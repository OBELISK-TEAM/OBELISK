import Header from "@/components/user-boards/Header";
import { CreateBoardProvider } from "@/contexts/CreateBoardContext";
export default function UserBoards({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-min-[100vh] flex flex-col">
      <CreateBoardProvider>
        <Header />
        <div className="flex">{children}</div>
      </CreateBoardProvider>
    </div>
  );
}
