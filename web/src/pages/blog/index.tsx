import { useState } from 'react';

import { ArticleCard } from '@/components/article-card';
import { ArticlePagination } from '@/components/article-pagination';
import BlogPanel from '@/components/blog-panel';
import PageTitle from '@/components/page-title';
import { useGetArticles } from '@/hooks/article/use-get-articles';

export function BlogPage() {
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 5;

	const { articles, totalPages, loading, error } = useGetArticles({
		public: true,
		preview: true,
		search: search || undefined,
		page: currentPage,
		limit,
	});

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<>
			<PageTitle subtitle="Blog" title="博客" />

			<BlogPanel onSearchChange={setSearch} searchValue={search} />

			<section className="section-base">
				{loading ? (
					<div className="flex items-center justify-center py-8">
						<p>Loading articles...</p>
					</div>
				) : error ? (
					<div className="flex items-center justify-center py-8">
						<p className="text-red-500">Error: {error}</p>
					</div>
				) : articles.length === 0 ? (
					<div className="flex items-center justify-center py-8">
						<p className="text-muted-foreground">暂无文章</p>
					</div>
				) : (
					<ul className="space-y-4">
						{articles.map((article) => (
							<ArticleCard article={article} key={article.id} />
						))}
					</ul>
				)}
			</section>

			{/* Pagination */}
			{totalPages > 1 && (
				<ArticlePagination
					currentPage={currentPage}
					onPageChange={handlePageChange}
					totalPages={totalPages}
				/>
			)}
		</>
	);
}
