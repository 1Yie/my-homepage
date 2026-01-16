import { Link } from 'react-router-dom';

import PageTitle from '@/components/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTags } from '@/hooks/tags/use-get-tags';
import { useSeo } from '@/hooks/use-page-meta';

export function TagsPage() {
	const { tags, loading, error } = useGetTags(true);
	useSeo({
		title: '标签',
		description: '文章标签 / ichiyo (@1Yie)',
		keywords: ['ichiyo', '一叶'],
	});

	if (error) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">加载标签失败: {error}</p>
			</div>
		);
	}

	return (
		<>
			<PageTitle subtitle="Tags" title="标签" />

			<section className="section-base">
				{loading ? (
					<div
						className="grid p-4 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3
							lg:grid-cols-4"
					>
						{Array.from({ length: 12 }).map((_, i) => (
							<Skeleton className="h-12 w-full rounded-none" key={i} />
						))}
					</div>
				) : (
					<div
						className="grid p-4 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3
							lg:grid-cols-4"
					>
						{tags.map((tag) => (
							<Link
								className="group block border bg-card p-4 text-center
									transition-all hover:border-foreground/50 hover:shadow-md"
								key={tag.id}
								to={`/tags/${encodeURIComponent(tag.name)}`}
							>
								<span className="text-sm font-medium">
									<span className="text-muted-foreground">#</span>
									{tag.name}
								</span>
							</Link>
						))}
						{tags.length === 0 && (
							<div className="col-span-full py-12 text-center">
								<p className="text-muted-foreground">暂无标签</p>
							</div>
						)}
					</div>
				)}
			</section>
		</>
	);
}
