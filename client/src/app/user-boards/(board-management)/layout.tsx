import Header from "@/components/user-boards/main-header/Header";
import { CreateBoardProvider } from "@/contexts/CreateBoardContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User boards | Obelisk",
  description: "Boards that you own or are shared with you",
};

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
