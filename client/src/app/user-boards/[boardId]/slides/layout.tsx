import { BoardDataProvider } from "@/contexts/BoardDataContext";

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return <BoardDataProvider>{children}</BoardDataProvider>;
}
