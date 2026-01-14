import { useParams } from 'react-router-dom';

import BlogTOC from '@/components/blog-toc';
import { Comments } from '@/components/comment';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import PageTitle from '@/components/page-title';
import { useGetArticleBySlug } from '@/hooks/article/use-get-article-by-slug';
import { useTitle } from '@/hooks/use-page-title';
import { cn } from '@/lib/utils';
import { NotFoundPage } from '@/pages/error/not-found';

export function BlogDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const { article, loading, error, isNotFound } = useGetArticleBySlug(slug);
	useTitle(article?.title as string);
	if (loading) {
		return (
			<>
				<PageTitle loading={true} type="blog" />
				<div className="h-full w-full">
					<section className="section-base">
						<div className="mx-auto max-w-5xl py-8 px-4">
							<div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
								<aside className="order-2 lg:order-1">
									<div className="space-y-2">
										{Array.from({ length: 5 }).map((_, i) => (
											<div
												className="h-4 bg-muted rounded animate-pulse"
												key={i}
											/>
										))}
									</div>
								</aside>
								<div className="order-1 lg:order-2">
									<div className="space-y-4">
										<div className="h-64 bg-muted rounded animate-pulse" />
										<div className="space-y-2">
											{Array.from({ length: 10 }).map((_, i) => (
												<div
													className="h-4 bg-muted rounded animate-pulse"
													key={i}
												/>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</>
		);
	}

	if (error) {
		if (isNotFound) {
			return <NotFoundPage />;
		}
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-center py-8">
						<p className="text-red-500">Error: {error}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!article) {
		return <NotFoundPage />;
	}

	const hasHeaders = /(?:^|\n)#{1,6}\s/.test(article.content);

	return (
		<>
			<PageTitle
				backgroundImage={article.headerImage ?? undefined}
				createdAt={article.createdAt}
				tags={article.tags}
				title={article.title}
				type="blog"
				updatedAt={article.updatedAt}
			/>
			<div className="h-full w-full">
				<section className="section-base">
					<div className="mx-auto max-w-5xl py-8 px-4 lg:px-0">
						<div
							className={cn(
								'grid grid-cols-1 gap-4 md:gap-8',
								hasHeaders && 'lg:grid-cols-[250px_1fr]'
							)}
						>
							{hasHeaders && (
								<aside>
									<BlogTOC />
								</aside>
							)}
							<div>
								<div className="prose prose-lg max-w-none">
									<MarkdownRenderer>{article.content}</MarkdownRenderer>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>

			<div className="border-t">
				<section className="section-base artalk">
					<div className="mx-auto max-w-5xl py-8 px-4 lg:px-0">
						<Comments />
					</div>
				</section>
			</div>
		</>
	);
}
