"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type Props = {
    isLoading?: boolean;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
};

export function Pagination({ isLoading = false, currentPage, setCurrentPage, totalPages }: Props) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | string)[] = [];

        // Always show first page
        if (currentPage > 2) {
            pages.push(1);
        }

        // Ellipsis before middle pages
        if (currentPage > 3) {
            pages.push("...");
        }

        // Middle pages (current -1, current, current +1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 0 && i <= totalPages) {
                pages.push(i);
            }
        }

        // Ellipsis after middle pages
        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        // Always show last page
        if (currentPage < totalPages - 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex items-center justify-center gap-1 md:gap-2">
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 md:p-2 cursor-pointer rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            </button>
            {pages.map((page, index) =>
                page === "..." ? (
                    <span
                        key={`dots-${index}`}
                        className="px-2 text-gray-500 text-sm"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-xs md:text-sm font-medium transition-colors cursor-pointer border border-gray-300 ${currentPage === page ? "!border-[#1E1E1E] bg-[#1E1E1E] text-white" : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {currentPage === page && isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : page}
                    </button>
                )
            )}
            <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 md:p-2 cursor-pointer rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            </button>
        </div>
    );
}