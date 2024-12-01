import { UniqueVisitors } from "@/app/user-boards/(board-management)/[boardId]/statistics/time-spent/_components/UniqueVisitors";
import { getUniqueVisitors } from "@/services/statistics/fetchUniqueVisitors";

const TimeSpentPage = async ({
  params,
}: {
  params: {
    boardId: string;
  };
}) => {
  const uniqueVisitorsData = await getUniqueVisitors(params.boardId);
  return <UniqueVisitors uniqueVisitors={uniqueVisitorsData} />;
};
export default TimeSpentPage;
