import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { ArticleCard } from '@/components/article-card';
import { ArticlePagination } from '@/components/article-pagination';
import PageTitle from '@/components/page-title';
import { useGetArticlesByTag } from '@/hooks/article/use-get-articles-by-tag';

export function TagArticlesPage() {
	const { tagName } = useParams<{ tagName: string }>();
	const decodedTagName = tagName ? decodeURIComponent(tagName) : '';
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 5;

	const { articles, totalPages, loading, error } = useGetArticlesByTag({
		tagName: decodedTagName,
		page: currentPage,
		limit,
	});

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (error) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">加载文章失败: {error}</p>
			</div>
		);
	}

	return (
		<>
			<PageTitle title={`#${decodedTagName}`} />

			{loading ? (
				<section className="section-base">
					<div className="space-y-6">
						{Array.from({ length: 3 }).map((_, i) => (
							<div className="space-y-3" key={i}>
								<div className="h-6 bg-muted rounded animate-pulse" />
								<div className="h-4 bg-muted rounded animate-pulse w-3/4" />
								<div className="h-4 bg-muted rounded animate-pulse w-1/2" />
							</div>
						))}
					</div>
				</section>
			) : articles.length === 0 ? (
				<section className="section-base">
					<div className="py-12 text-center">
						<p className="text-muted-foreground">
							没有找到带有 "{decodedTagName}" 标签的文章
						</p>
						<Link
							className="mt-4 inline-block text-primary hover:underline"
							to="/tags"
						>
							浏览所有标签
						</Link>
					</div>
				</section>
			) : (
				<>
					<section className="section-base">
						<ul className="space-y-4">
							{articles.map((article) => (
								<ArticleCard article={article} key={article.id} />
							))}
						</ul>
					</section>

					{totalPages > 1 && (
						<ArticlePagination
							currentPage={currentPage}
							onPageChange={handlePageChange}
							totalPages={totalPages}
						/>
					)}
				</>
			)}
		</>
	);
}
