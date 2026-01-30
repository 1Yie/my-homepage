import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

interface ArticlePaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function ArticlePagination({
	currentPage,
	totalPages,
	onPageChange,
}: ArticlePaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<div className="border-t">
			<section className="section-base">
				<Pagination className="py-4">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								className={
									currentPage === 1
										? 'pointer-events-none opacity-50'
										: 'cursor-pointer'
								}
								onClick={() => onPageChange(Math.max(1, currentPage - 1))}
							>
								<ChevronLeftIcon className="sm:-ms-1" />
								<span className="max-sm:hidden">上一页</span>
							</PaginationPrevious>
						</PaginationItem>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									className="cursor-pointer"
									isActive={page === currentPage}
									onClick={() => onPageChange(page)}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								className={
									currentPage === totalPages
										? 'pointer-events-none opacity-50'
										: 'cursor-pointer'
								}
								onClick={() =>
									onPageChange(Math.min(totalPages, currentPage + 1))
								}
							>
								<span className="max-sm:hidden">下一页</span>
								<ChevronRightIcon className="sm:-me-1" />
							</PaginationNext>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</section>
		</div>
	);
}
