import { db } from '../lib/db';

export interface DashboardStats {
	// 总体统计
	overview: {
		totalArticles: number;
		publishedArticles: number;
		draftArticles: number;
		totalProjects: number;
		totalSlides: number;
		totalTags: number;
		totalUsers: number;
	};

	// 最近文章（最新 10 篇）
	recentArticles: Array<{
		id: number;
		title: string;
		slug: string;
		isDraft: boolean;
		createdAt: Date;
		updatedAt: Date;
		author: {
			id: string;
			name: string;
			email: string;
		};
		tags: Array<{
			id: number;
			name: string;
		}>;
	}>;

	// 最近项目（最新 5 个）
	recentProjects: Array<{
		id: number;
		name: string;
		description: string;
		tags: string[];
		imageUrl: string | null;
		githubUrl: string | null;
		liveUrl: string | null;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}>;

	// 最近相册图片（最新 5 张）
	recentSlides: Array<{
		id: number;
		title: string;
		src: string;
		button: string | null;
		link: string | null;
		newTab: boolean;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}>;

	// 文章按月份统计（最近 12 个月）
	articlesByMonth: Array<{
		month: string; // YYYY-MM 格式
		count: number;
		publishedCount: number;
		draftCount: number;
	}>;

	// 热门标签（按文章数量排序，前 10 个）
	topTags: Array<{
		id: number;
		name: string;
		articleCount: number;
	}>;

	// 文章状态分布
	articleStatusDistribution: {
		published: number;
		draft: number;
	};

	// 最近 7 天的文章创建趋势
	recentActivityTrend: Array<{
		date: string; // YYYY-MM-DD 格式
		articlesCreated: number;
		projectsCreated: number;
		slidesCreated: number;
	}>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
	// 1. 获取总体统计
	const [
		totalArticles,
		publishedArticles,
		draftArticles,
		totalProjects,
		totalSlides,
		totalTags,
		totalUsers,
	] = await Promise.all([
		db.article.count(),
		db.article.count({ where: { isDraft: false } }),
		db.article.count({ where: { isDraft: true } }),
		db.project.count(),
		db.slide.count(),
		db.tag.count(),
		db.user.count(),
	]);

	// 2. 获取最近 10 篇文章
	const recentArticles = await db.article.findMany({
		take: 10,
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			tags: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	// 3. 获取最近 5 个项目
	const recentProjects = await db.project.findMany({
		take: 5,
		orderBy: { createdAt: 'desc' },
	});

	// 4. 获取最近 5 张相册图片
	const recentSlides = await db.slide.findMany({
		take: 5,
		orderBy: { createdAt: 'desc' },
	});

	// 5. 获取所有文章用于统计
	const allArticles = await db.article.findMany({
		select: {
			createdAt: true,
			isDraft: true,
		},
	});

	// 6. 计算按月份统计（最近 12 个月）
	const now = new Date();
	const monthsMap = new Map<
		string,
		{ count: number; published: number; draft: number }
	>();

	// 初始化最近 12 个月
	for (let i = 11; i >= 0; i--) {
		const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		monthsMap.set(monthKey, { count: 0, published: 0, draft: 0 });
	}

	// 统计文章
	for (const article of allArticles) {
		const date = new Date(article.createdAt);
		const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

		if (monthsMap.has(monthKey)) {
			const stats = monthsMap.get(monthKey)!;
			stats.count++;
			if (article.isDraft) {
				stats.draft++;
			} else {
				stats.published++;
			}
		}
	}

	const articlesByMonth = Array.from(monthsMap.entries()).map(
		([month, stats]) => ({
			month,
			count: stats.count,
			publishedCount: stats.published,
			draftCount: stats.draft,
		})
	);

	// 7. 获取热门标签
	const tagsWithCount = await db.tag.findMany({
		include: {
			_count: {
				select: {
					articles: true,
				},
			},
		},
		orderBy: {
			articles: {
				_count: 'desc',
			},
		},
		take: 10,
	});

	const topTags = tagsWithCount.map((tag) => ({
		id: tag.id,
		name: tag.name,
		articleCount: tag._count.articles,
	}));

	// 8. 文章状态分布
	const articleStatusDistribution = {
		published: publishedArticles,
		draft: draftArticles,
	};

	// 9. 最近 7 天的活动趋势
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
	sevenDaysAgo.setHours(0, 0, 0, 0);

	const [recentArticlesForTrend, recentProjectsForTrend, recentSlidesForTrend] =
		await Promise.all([
			db.article.findMany({
				where: {
					createdAt: {
						gte: sevenDaysAgo,
					},
				},
				select: {
					createdAt: true,
				},
			}),
			db.project.findMany({
				where: {
					createdAt: {
						gte: sevenDaysAgo,
					},
				},
				select: {
					createdAt: true,
				},
			}),
			db.slide.findMany({
				where: {
					createdAt: {
						gte: sevenDaysAgo,
					},
				},
				select: {
					createdAt: true,
				},
			}),
		]);

	// 创建最近 7 天的日期映射
	const trendMap = new Map<
		string,
		{ articles: number; projects: number; slides: number }
	>();
	for (let i = 0; i < 7; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dateKey = date.toISOString().split('T')[0];
		trendMap.set(dateKey, { articles: 0, projects: 0, slides: 0 });
	}

	// 统计每天的创建数量
	for (const article of recentArticlesForTrend) {
		const dateKey = new Date(article.createdAt).toISOString().split('T')[0];
		if (trendMap.has(dateKey)) {
			trendMap.get(dateKey)!.articles++;
		}
	}

	for (const project of recentProjectsForTrend) {
		const dateKey = new Date(project.createdAt).toISOString().split('T')[0];
		if (trendMap.has(dateKey)) {
			trendMap.get(dateKey)!.projects++;
		}
	}

	for (const slide of recentSlidesForTrend) {
		const dateKey = new Date(slide.createdAt).toISOString().split('T')[0];
		if (trendMap.has(dateKey)) {
			trendMap.get(dateKey)!.slides++;
		}
	}

	const recentActivityTrend = Array.from(trendMap.entries())
		.map(([date, counts]) => ({
			date,
			articlesCreated: counts.articles,
			projectsCreated: counts.projects,
			slidesCreated: counts.slides,
		}))
		.sort((a, b) => a.date.localeCompare(b.date));

	// 返回完整的仪表盘统计数据
	return {
		overview: {
			totalArticles,
			publishedArticles,
			draftArticles,
			totalProjects,
			totalSlides,
			totalTags,
			totalUsers,
		},
		recentArticles: recentArticles.map((article) => ({
			id: article.id,
			title: article.title,
			slug: article.slug,
			isDraft: article.isDraft,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt,
			author: article.author,
			tags: article.tags,
		})),
		recentProjects: recentProjects.map((project) => ({
			id: project.id,
			name: project.name,
			description: project.description,
			tags: JSON.parse(project.tags) as string[],
			imageUrl: project.imageUrl,
			githubUrl: project.githubUrl,
			liveUrl: project.liveUrl,
			order: project.order,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt,
		})),
		recentSlides,
		articlesByMonth,
		topTags,
		articleStatusDistribution,
		recentActivityTrend,
	};
}
