import { TimeSpentCard } from "@/app/user-boards/(board-management)/[boardId]/statistics/time-spent/_components/TimeSpentCard";

const TimeSpentPage = async ({
  params,
}: {
  params: {
    boardId: string;
  };
}) => {
  return <TimeSpentCard boardId={params.boardId} />;
};
export default TimeSpentPage;
