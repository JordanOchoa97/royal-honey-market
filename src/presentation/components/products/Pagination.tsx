'use client';

import styled from 'styled-components';
import { memo, useMemo } from 'react';
import { Button } from '../ui/Button';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const PaginationContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  padding: 1rem 0;

  @media (max-width: 768px) {
    margin-top: 2rem;
    gap: 0.25rem;
  }
`;

const PageButton = styled(Button)<{ $isActive?: boolean }>`
  min-width: 2.5rem;
  padding: 0.5rem 1rem;
  background: ${props => (props.$isActive ? '#f59e0b' : 'white')};
  color: ${props => (props.$isActive ? 'white' : '#6b7280')};
  border: 2px solid ${props => (props.$isActive ? '#f59e0b' : '#e5e7eb')};
  font-weight: ${props => (props.$isActive ? '700' : '600')};

  &:hover:not(:disabled) {
    background: ${props => (props.$isActive ? '#f59e0b' : '#f9fafb')};
    transform: none;
    box-shadow: none;
    border-color: #f59e0b;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    min-width: 2rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const Ellipsis = styled.span`
  color: #9ca3af;
  font-size: 1rem;
  padding: 0 0.5rem;
  user-select: none;
`;

const PageInfo = styled.div`
  display: none;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  width: 100%;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const Pagination = memo(({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    const maxVisible = 7; // Máximo de botones visibles
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      startPage = 2;
      endPage = 5;
    }

    if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
      endPage = totalPages - 1;
    }

    if (startPage > 2) {
      pages.push('ellipsis-start');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <>
      <PaginationContainer aria-label="Pagination Navigation">
        <PageButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="Previous page"
        >
          ← Prev
        </PageButton>

        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return <Ellipsis key={page}>...</Ellipsis>;
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <PageButton
              key={pageNum}
              variant="ghost"
              size="sm"
              $isActive={isActive}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </PageButton>
          );
        })}

        <PageButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          aria-label="Next page"
        >
          Next →
        </PageButton>
      </PaginationContainer>

      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
    </>
  );
});

Pagination.displayName = 'Pagination';