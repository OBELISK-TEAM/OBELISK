import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationDemoProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BoardsPagination({ currentPage, totalPages, onPageChange }: PaginationDemoProps) {
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
    <Pagination className="w-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePrevious} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {/* Optionally, you can add more page links here */}
        <PaginationItem>
          <PaginationNext href="#" onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
