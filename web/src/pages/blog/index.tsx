import { useState } from 'react';

import BlogPanel from '@/components/blog-panel';
import PageTitle from '@/components/page-title';
import { useGetArticles } from '@/hooks/article/use-get-articles';

export function BlogPage() {
	const [search, setSearch] = useState('');
	const { articles, loading, error } = useGetArticles({
		public: true,
	});

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
							<li className="m-0 border-b p-0 last:border-b-0" key={article.id}>
								<div
									className="group relative flex flex-col transition-colors
										duration-300 hover:bg-accent/50"
								>
									<a
										aria-label={article.slug}
										className="absolute inset-0 z-0"
										href={`/blog/${article.slug}`}
									/>

									<div className="pointer-events-none relative z-10 p-4 pb-4">
										<p className="text-2xl font-semibold">{article.slug}</p>
										<p className="text-lg text-muted-foreground">
											{new Date(article.createdAt).toLocaleDateString()}
										</p>
										<p className="text-sm text-muted-foreground">
											By {article.author?.name || 'Unknown'}
										</p>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>
		</>
	);
}
