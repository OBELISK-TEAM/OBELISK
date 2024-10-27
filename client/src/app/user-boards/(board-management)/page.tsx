import UserBoards from "@/components/user-boards/UserBoards";
import { getCookie } from "@/lib/authApiUtils";
import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import { fetchBoards } from "@/services/board/fetchBoards";
import {
  boardActiveTabConverter,
  BoardsActiveTab,
  BoardsActiveTabMap,
  BoardsActiveTabReverseMap,
} from "@/enums/BoardsActiveTab";

export default async function UserBoardsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const accessToken = getCookie("accessToken");

  const tabParam = Array.isArray(searchParams.tab) ? searchParams.tab[0] : searchParams.tab || "OWNED_BY";
  const activeTab = BoardsActiveTabReverseMap[tabParam] || BoardsActiveTab.OWNED_BY;

  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  try {
    const data: PaginatedBoardsResponse = await fetchBoards(accessToken as string)(
      `/boards?tab=${boardActiveTabConverter(BoardsActiveTabMap[activeTab])}&page=${currentPage}&limit=5`
    );

    return <UserBoards data={data} activeTab={activeTab} currentPage={currentPage} />;
  } catch (error: any) {
    return (
      <div className="ms-center flex h-fit w-screen justify-center rounded-lg border bg-card p-4">
        <p className={"text-red-600"}>{"Oops! " + error.message || "error while fetching boards"}</p>
      </div>
    );
  }
}
