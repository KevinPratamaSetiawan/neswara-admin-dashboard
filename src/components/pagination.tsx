import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, itemsPerPage, totalItems, totalPages, onPageChange }: PaginationProps) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                            onPageChange(currentPage - 1);
                        }
                    }}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    Previous
                </a>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                            onPageChange(currentPage + 1);
                        }
                    }}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> results
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
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <span className="sr-only">Previous</span>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </a>
                        {pageNumbers.map((page) => (
                            <a
                                key={page}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page);
                                }}
                                aria-current={page === currentPage ? 'page' : undefined}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'} focus:z-20 focus:outline-offset-0`}
                            >
                                {page}
                            </a>
                        ))}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) {
                                    onPageChange(currentPage + 1);
                                }
                            }}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
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
