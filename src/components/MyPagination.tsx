import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "./ui/pagination";

const MyPagination = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${currentPage > 1 ? "" : "dark:bg-gray-700 cursor-not-allowed"}`}
            href={{
              pathname: "/dashboard",
              query: { page: currentPage > 1 ? currentPage - 1 : 1 },
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href='#'>{currentPage}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={`${
              currentPage < totalPages ? "" : "dark:bg-gray-700 cursor-not-allowed"
            }`}
            href={{
              pathname: "/dashboard",
              query: { page: currentPage < totalPages ? currentPage + 1 : totalPages },
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default MyPagination;
