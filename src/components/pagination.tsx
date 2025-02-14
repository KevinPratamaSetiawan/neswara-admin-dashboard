import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, itemsPerPage, totalItems, totalPages, onPageChange }: PaginationProps) {
    const [goTo, setGoTo] = useState('');

    const onGoToPage = () => {
        if (isNaN(parseInt(goTo)) || parseInt(goTo) <= 0 || parseInt(goTo) > totalPages) {
            setGoTo('');
            return;
        }

        onPageChange(parseInt(goTo))
        setGoTo('');
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === currentPage - 1 ||
                i === currentPage ||
                i === currentPage + 1 ||
                i === totalPages
            ) {
                pageNumbers.push(
                    <a key={i} href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(i);
                        }}
                        aria-current={i === currentPage ? 'page' : undefined}
                        className={`relative ${i === 1 || i === currentPage || i === totalPages ? 'inline-flex' : 'hidden sm:inline-flex'} items-center px-4 py-2 text-sm font-semibold ${i === currentPage ? 'bg-primary/80 text-white' : 'text-secondaryText dark:text-darkSecondaryText button-hover button-ring border border-border'} focus:z-20 focus:outline-offset-0`}
                    >
                        {i}
                    </a>
                );
            } else if (i === 2 || i === totalPages - 1) {
                pageNumbers.push(
                    <input type='text' key={i}
                        value={goTo}
                        placeholder='...'
                        onChange={(e) => setGoTo(e.target.value)}
                        onBlur={() => onGoToPage()}
                        aria-label={'Go to page input'}
                        className={`w-10 relative inline-flex items-center px-1 py-2 placeholder-secondaryText dark:placeholder-darkSecondaryText text-center text-sm font-semibold text-text dark:text-darkText bg-card dark:bg-darkCard button-hover focus:z-20 focus:outline-offset-0  border border-border`}
                    />
                );
            }
        }
        return pageNumbers;
    };

    return (
        <div className="w-full text-secondaryText dark:text-darkSecondaryText flex items-center justify-between border-t border-border dark:border-darkBorder lg:px-4 py-3 sm:px-6">
            <div className="flex flex-1 items-center justify-center lg:justify-between">
                <div className='hidden lg:block'>
                    <p className="text-sm">
                        Showing <span className="font-medium text-text dark:text-darkText">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium text-text dark:text-darkText">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                        <span className="font-medium text-text dark:text-darkText">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) {
                                    onPageChange(currentPage - 1);
                                }
                            }}
                            className={`relative inline-flex items-center rounded-l-md border border-border px-2 py-2 text-secondaryText dark:text-darkSecondaryText button-hover button-ring focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <span className="sr-only">Previous</span>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </a>
                        {renderPageNumbers()}

                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) {
                                    onPageChange(currentPage + 1);
                                }
                            }}
                            className={`relative inline-flex items-center rounded-r-md border border-border px-2 py-2 text-secondaryText dark:text-darkSecondaryText button-hover button-ring focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <span className="sr-only">Next</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    );
}
