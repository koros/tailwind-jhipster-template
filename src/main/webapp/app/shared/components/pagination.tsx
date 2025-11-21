import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  activePage: number;
  itemsPerPage: number;
  totalItems: number;
  maxButtons?: number;
  onSelect: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ activePage, itemsPerPage, totalItems, maxButtons = 5, onSelect }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfMaxButtons = Math.floor(maxButtons / 2);

    let startPage = Math.max(1, activePage - halfMaxButtons);
    let endPage = Math.min(totalPages, activePage + halfMaxButtons);

    if (activePage <= halfMaxButtons) {
      endPage = Math.min(maxButtons, totalPages);
    }

    if (activePage + halfMaxButtons >= totalPages) {
      startPage = Math.max(1, totalPages - maxButtons + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center space-x-1">
      <button
        onClick={() => onSelect(activePage - 1)}
        disabled={activePage === 1}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          activePage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }`}
        aria-label="Previous page"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
      </button>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === activePage;

        return (
          <button
            key={pageNumber}
            onClick={() => onSelect(pageNumber)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
            aria-label={`Page ${pageNumber}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => onSelect(activePage + 1)}
        disabled={activePage === totalPages}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          activePage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }`}
        aria-label="Next page"
      >
        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
      </button>
    </nav>
  );
};
