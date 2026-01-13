import { Link } from 'react-router-dom';

import type { Article } from '@/hooks/article/use-get-articles';

import PageTitle from '@/components/page-title';
import { useGetArticles } from '@/hooks/article/use-get-articles';

type GroupedPosts = {
	year: string;
	months: {
		month: string;
		posts: Article[];
	}[];
}[];

function groupPostsStructured(posts: Article[]): GroupedPosts {
	const groups: Record<string, Record<string, Article[]>> = {};

	posts.forEach((post) => {
		const date = new Date(post.createdAt);
		const year = date.getFullYear().toString();
		const month = (date.getMonth() + 1).toString();

		if (!groups[year]) groups[year] = {};
		if (!groups[year][month]) groups[year][month] = [];
		groups[year][month].push(post);
	});

	return Object.keys(groups)
		.sort((a, b) => b.localeCompare(a))
		.map((year) => ({
			year,
			months: Object.keys(groups[year])
				.sort((a, b) => b.localeCompare(a))
				.map((month) => ({
					month,
					posts: groups[year][month],
				})),
		}));
}

function ArchiveContent({ articles }: { articles: Article[] }) {
	const grouped = groupPostsStructured(articles);

	return (
		<section className="section-base">
			<div className="mx-auto max-w-5xl p-6 sm:p-12">
				<div className="space-y-20">
					{grouped.map((group) => (
						<div
							className="relative flex flex-col gap-8 md:flex-row md:gap-16"
							key={group.year}
						>
							<div className="md:w-44 md:shrink-0">
								<h2
									className="sticky top-24 text-6xl leading-none font-bold
										md:text-right whitespace-nowrap"
								>
									<span
										className="bg-gradient-to-b from-gray-700 to-gray-100
											bg-clip-text text-transparent dark:from-gray-100
											dark:to-gray-500"
									>
										{group.year}
									</span>
									<span
										className="ml-1 text-xl font-medium text-gray-400
											dark:text-gray-600"
									>
										年
									</span>
								</h2>
							</div>

							<div
								className="relative flex-1 border-l border-gray-200
									dark:border-gray-800"
							>
								<div className="flex flex-col gap-12 pl-8 md:pl-12">
									{group.months.map((item) => (
										<div className="relative" key={item.month}>
											<div
												className="absolute top-2 -left-[38px] h-3 w-3
													rounded-full border-2 border-white bg-gray-300
													md:-left-[54px] dark:border-black dark:bg-gray-600"
											/>

											{/* 月份标题 */}
											<h3
												className="mb-6 text-xl font-bold text-gray-900
													dark:text-gray-100"
											>
												{item.month}{' '}
												<span className="text-sm font-normal text-gray-500">
													月
												</span>
											</h3>

											{/* 文章列表 */}
											<ul className="space-y-3">
												{item.posts.map((post) => {
													const day = new Date(post.createdAt)
														.getDate()
														.toString()
														.padStart(2, '0');
													return (
														<li className="group" key={post.id}>
															<Link
																className="flex items-baseline gap-6 rounded-lg
																	py-2 transition-all duration-300
																	hover:translate-x-2"
																to={`/blog/${post.slug}`}
															>
																{/* 具体天数 */}
																<span
																	className="group-hover:text-primary font-mono
																		text-sm font-medium text-gray-400"
																>
																	{day}{' '}
																	<span className="text-[10px] opacity-60">
																		日
																	</span>
																</span>

																{/* 文章标题 */}
																<span
																	className="text-lg text-gray-700
																		transition-colors group-hover:font-medium
																		group-hover:text-black dark:text-gray-300
																		dark:group-hover:text-white"
																>
																	{post.title}
																</span>
															</Link>
														</li>
													);
												})}
											</ul>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export function ArchivePage() {
	const { articles, loading, error } = useGetArticles({
		public: true,
		limit: 1000, // 获取所有文章
	});

	return (
		<>
			<PageTitle subtitle="Archive" title="归档" />

			{loading ? (
				<section className="section-base">
					<div className="flex items-center justify-center py-16">
						<div
							className="h-8 w-8 animate-spin rounded-full border-4
								border-primary border-t-transparent"
						/>
					</div>
				</section>
			) : error ? (
				<section className="section-base">
					<div className="flex items-center justify-center py-8">
						<p className="text-red-500">错误: {error}</p>
					</div>
				</section>
			) : articles.length === 0 ? (
				<section className="section-base">
					<div className="flex items-center justify-center py-8">
						<p className="text-muted-foreground">暂无文章</p>
					</div>
				</section>
			) : (
				<ArchiveContent articles={articles} />
			)}
		</>
	);
}
