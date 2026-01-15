import { useState } from 'react';

import { ArticleCard } from '@/components/article-card';
import { ArticlePagination } from '@/components/article-pagination';
import BlogPanel from '@/components/blog-panel';
import PageTitle from '@/components/page-title';
import { useGetArticles } from '@/hooks/article/use-get-articles';
import { useSeo } from '@/hooks/use-page-meta';

export function BlogPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 5;
	useSeo({
		title: '博客',
		description: '记录 / 分享 / 唠嗑 / 闲聊 / ichiyo (@1Yie)',
		keywords: ['ichiyo', '一叶', '博客', 'blog', 'Blog'],
	});
	const { articles, totalPages, loading, error } = useGetArticles({
		public: true,
		preview: true,
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

			<BlogPanel />

			<section className="section-base">
				{loading ? (
					<ul className="divide-y">
						{Array.from({ length: 5 }).map((_, i) => (
							<li className="p-6" key={i}>
								<div className="flex gap-8">
									{i === 0 && (
										<div className="shrink-0">
											<div className="h-36 w-48 bg-muted rounded animate-pulse" />
										</div>
									)}
									<div
										className={`flex-1 min-w-0 space-y-3
											${i === 0 ? '' : 'ml-0'}`}
									>
										<div className="h-8 bg-muted rounded animate-pulse w-3/4" />
										<div className="h-5 bg-muted rounded animate-pulse w-1/2" />
										<div className="h-4 bg-muted rounded animate-pulse w-1/4" />
										<div className="h-4 bg-muted rounded animate-pulse" />
									</div>
								</div>
							</li>
						))}
					</ul>
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
