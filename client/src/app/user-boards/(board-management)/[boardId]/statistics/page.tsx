import { redirect } from "next/navigation";

interface StatisticsPageProps {
  params: {
    boardId: string;
  };
}
const StatisticsPage = ({ params }: StatisticsPageProps) => {
  return redirect(`/user-boards/${params.boardId}/statistics/activity`);
};
export default StatisticsPage;
