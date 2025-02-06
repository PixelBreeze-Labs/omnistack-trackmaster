import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import InputSelect from "../Common/InputSelect";

const TablePagination = ({ 
  page, 
  setPage, 
  pageSize, 
  setPageSize, 
  totalCount, 
  itemsShown 
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > 5) {
      if (page <= 3) {
        endPage = 5;
      } else if (page >= totalPages - 2) {
        startPage = totalPages - 4;
      } else {
        startPage = page - 2;
        endPage = page + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="border-t px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <InputSelect
          name="pageSize"
          label=""
          value={pageSize.toString()}
          onChange={(e) => {
            const newSize = parseInt(e.target.value);
            setPageSize(newSize);
            // Adjust current page when changing page size
            const newTotalPages = Math.ceil(totalCount / newSize);
            if (page > newTotalPages) {
              setPage(newTotalPages);
            }
          }}
          options={[
            { value: "10", label: "10 rows" },
            { value: "20", label: "20 rows" },
            { value: "50", label: "50 rows" }
          ]}
        />
        
        <div className="flex-1 flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={page === pageNum}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        
        <p className="text-sm text-muted-foreground min-w-[180px] text-right">
          Showing {itemsShown} of {totalCount} registrations
        </p>
      </div>
    </div>
  );
};

export default TablePagination;