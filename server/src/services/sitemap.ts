import { db } from '../lib/db';

export interface ArticleForSitemap {
	title: string;
	slug: string;
	updatedAt: Date;
}

export interface TagWithArticlesForSitemap {
	name: string;
	articles: ArticleForSitemap[];
}

export async function getArticlesForSitemap(): Promise<ArticleForSitemap[]> {
	return await db.article.findMany({
		where: {
			isDraft: false,
		},
		select: {
			title: true,
			slug: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: 'desc',
		},
	});
}

export async function getTagsWithArticlesForSitemap(): Promise<
	TagWithArticlesForSitemap[]
> {
	const tags = await db.tag.findMany({
		include: {
			articles: {
				where: {
					isDraft: false,
				},
				select: {
					title: true,
					slug: true,
					updatedAt: true,
				},
				orderBy: {
					updatedAt: 'desc',
				},
			},
		},
		orderBy: {
			name: 'asc',
		},
	});

	return tags
		.filter((tag) => tag.articles.length > 0)
		.map((tag) => ({
			name: tag.name,
			articles: tag.articles,
		}));
}
