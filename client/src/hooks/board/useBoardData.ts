import useSWR from "swr";
import { BoardDataResponse } from "@/interfaces/responses/board-data-response";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useBoardData = (boardId: string, slideIndex: string) => {
  const { data, error, mutate } = useSWR<BoardDataResponse>(
    `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/${boardId}?slide=${slideIndex}`,
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutateBoardData: mutate,
  };
};
