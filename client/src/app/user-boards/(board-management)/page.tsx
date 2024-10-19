import UserBoards from "@/components/user-boards/UserBoards";
import { getCookie } from "@/lib/authApiUtils";

export default function UserBoardsPage() {
  const accessToken = getCookie("accessToken");
  return <UserBoards accessToken={accessToken} />;
}
