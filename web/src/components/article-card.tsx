import { CalendarDays, Clock, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Article } from '@/hooks/article/use-get-articles';

interface ArticleCardProps {
	article: Article;
}

function extractPreview(content: string, maxLength: number = 150): string {
	const plainText = content
		.replace(/^#+\s*/gm, '')
		.replace(/\[[^\]]+\]\([^)]+\)/g, '$1')
		.replace(/[*_`]/g, '')
		.trim();

	const sentences = plainText
		.split(/[.!?]+/)
		.filter((s) => s.trim().length > 0);
	let preview = sentences.slice(0, 2).join('. ');

	if (preview.length > maxLength) {
		preview = preview.substring(0, maxLength).trim() + '...';
	}

	return preview || 'No preview available';
}

export function ArticleCard({ article }: ArticleCardProps) {
	return (
		<li className="m-0 border-b p-0 last:border-b-0">
			<div
				className="group relative flex flex-col transition-colors duration-300
					hover:bg-accent/50"
			>
				<Link
					aria-label={article.title}
					className="absolute inset-0 z-0"
					to={`/blog/${article.slug}`}
				/>

				<div
					className="pointer-events-none relative z-10 flex flex-col md:flex-row
						gap-8 p-6 pb-6"
				>
					{article.headerImage && (
						<div className="shrink-0">
							<img
								alt={article.title}
								className="h-42 md:h-36 w-full object-cover"
								src={article.headerImage}
							/>
						</div>
					)}
					<div className="flex-1 min-w-0">
						<p className="text-2xl font-semibold">{article.title}</p>
						<div className="text-lg text-muted-foreground flex items-center
							gap-4">
							{(() => {
								const created = new Date(article.createdAt);
								const updated = new Date(article.updatedAt);
								const sameDay =
									created.toDateString() === updated.toDateString();
								const timeDiff =
									Math.abs(updated.getTime() - created.getTime()) <
									30 * 60 * 1000;
								const formatDateTime = (date: Date) => {
									const year = date.getFullYear();
									const month = date.getMonth() + 1;
									const day = date.getDate();
									const hours = date.getHours().toString().padStart(2, '0');
									const minutes = date.getMinutes().toString().padStart(2, '0');
									return `${year}/${month}/${day} ${hours}:${minutes}`;
								};
								return (
									<>
										<div className="flex items-center gap-1">
											<CalendarDays className="w-4 h-4" />
											<span>{formatDateTime(created)}</span>
										</div>
										{!(sameDay && timeDiff) && (
											<div className="flex items-center gap-1">
												<Edit className="w-4 h-4" />
												<span>{formatDateTime(updated)}</span>
											</div>
										)}
									</>
								);
							})()}
						</div>
						<p
							className="text-sm text-muted-foreground mt-1 flex items-center
								gap-1"
						>
							<Clock className="w-4 h-4" />
							{(() => {
								const time = article.readingTime;
								if (!time || time < 1) return '< 1分钟阅读';
								return `${time}分钟阅读`;
							})()}
						</p>
						{article.tags.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-2">
								{article.tags.map((tag) => (
									<span
										className="inline-block bg-secondary
											text-secondary-foreground text-xs px-2 py-1 rounded-md"
										key={tag.id}
									>
										{tag.name}
									</span>
								))}
							</div>
						)}
						<p className="text-sm text-muted-foreground mt-2 line-clamp-1">
							{extractPreview(article.content)}
						</p>
					</div>
				</div>
			</div>
		</li>
	);
}
