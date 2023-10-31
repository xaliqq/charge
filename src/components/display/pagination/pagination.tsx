/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { BiArrowFromLeft, BiArrowFromRight } from 'react-icons/bi';

interface PaginationProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  totalCount,
  currentPage,
  pageSize,
  onPageChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

const getPagesToShow = () => {
  const pageRange = 1; // Number of pages to show before and after the current page
  const pages: (number | string)[] = [];
  const startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, currentPage + pageRange);

  if (currentPage - pageRange > 1) {
    pages.push(1);
    pages.push('...');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (currentPage + pageRange < totalPages) {
    pages.push('...');
    pages.push(totalPages);
  }

  return pages;
};

  const handlePageChange = (page: number) => {
    if (
      page === currentPage ||
      page < 1 ||
      page > totalPages ||
      typeof page === 'string'
    )
      return;
    onPageChange(page);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="sm"
      >
        <BiArrowFromRight />
      </Button>
      {getPagesToShow().map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <Button
              onClick={() => handlePageChange(page)}
              variant={page === currentPage ? 'solid' : 'outline'}
              colorScheme="teal"
              size="sm"
              mx={1}
            >
              {page}
            </Button>
          ) : (
            <Text mx={1}>{page}</Text>
          )}
        </React.Fragment>
      ))}
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="sm"
      >
        <BiArrowFromLeft />
      </Button>
    </Box>
  );
}

export default Pagination;
