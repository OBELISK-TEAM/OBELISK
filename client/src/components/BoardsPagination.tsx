import { ExtendedPagination } from "@/components/ExtendedPagination";

interface BoardsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BoardsPagination({ currentPage, totalPages, onPageChange }: BoardsPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <ExtendedPagination
      className="w-fit"
      currentPage={currentPage - 1}
      totalPages={totalPages}
      onPageChange={(page) => onPageChange(page + 1)}
      handlePrevious={handlePrevious}
      handleNext={handleNext}
      text="page"
    />
  );
}
