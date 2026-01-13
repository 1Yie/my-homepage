import { useParams } from 'react-router-dom';

import BlogTOC from '@/components/blog-toc';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import PageTitle from '@/components/page-title';
import { useGetArticleBySlug } from '@/hooks/article/use-get-article-by-slug';

export function BlogDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const { article, loading, error } = useGetArticleBySlug(slug);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-center py-8">
						<p>Loading article...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
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
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-center py-8">
						<p className="text-muted-foreground">Article not found</p>
					</div>
				</div>
			</div>
		);
	}

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
					<div className="mx-auto max-w-5xl py-8">
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
							<aside className="order-2 lg:order-1">
								<BlogTOC />
							</aside>
							<div className="order-1 lg:order-2">
								<div className="prose prose-lg max-w-none">
									<MarkdownRenderer>{article.content}</MarkdownRenderer>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
