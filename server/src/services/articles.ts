import type { createArticleSchema, updateArticleSchema } from '../lib/schema';

import { Prisma } from '../../prisma/generated/prisma/client';
import { db } from '../lib/db';

function estimateReadingTime(content: string): number {
	const plainText = content
		.replace(/<[^>]*>/g, '') // Remove HTML tags
		.replace(/^#+\s*/gm, '')
		.replace(/\[[^\]]+\]\([^)]+\)/g, '$1')
		.replace(/[*_`]/g, '')
		.trim();
	const charCount = plainText.length;
	const charsPerMinute = 400; // 中文阅读速度大约400字/分钟
	return Math.ceil(charCount / charsPerMinute);
}

export async function createArticle(
	data: typeof createArticleSchema.static,
	authorId: string
) {
	const { tagIds, ...articleData } = data;
	return db.article.create({
		data: {
			...articleData,
			authorId,
			tags: tagIds
				? {
						connect: tagIds.map((id) => ({ id })),
					}
				: undefined,
		},
		include: {
			tags: true,
		},
	});
}

export async function updateArticle(
	id: number,
	data: typeof updateArticleSchema.static,
	authorId: string
) {
	const { tagIds, ...updateData } = data;
	return db.article.update({
		where: {
			id,
			authorId,
		},
		data: {
			...updateData,
			tags: tagIds
				? {
						set: tagIds.map((id) => ({ id })),
					}
				: undefined,
		},
		include: {
			tags: true,
		},
	});
}

export async function deleteArticle(id: number, authorId: string) {
	return db.article.delete({
		where: {
			id,
			authorId,
		},
	});
}

export async function getArticle(id: number) {
	return db.article.findUnique({
		where: { id },
		include: {
			tags: true,
			author: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});
}

export async function getArticlesByAuthor(authorId: string, search?: string) {
	const where: Prisma.ArticleWhereInput = { authorId };
	if (search) {
		where.OR = [
			{ content: { contains: search } },
			{ slug: { contains: search } },
		];
	}
	return db.article.findMany({
		where,
		include: {
			tags: true,
		},
	});
}

export async function getPublishedArticles(
	search?: string,
	preview = false,
	page = 1,
	limit = 10
) {
	const where: Prisma.ArticleWhereInput = { isDraft: false };
	if (search) {
		where.OR = [
			{ content: { contains: search } },
			{ title: { contains: search } },
			{ slug: { contains: search } },
		];
	}

	const skip = (page - 1) * limit;

	const [articles, total] = await Promise.all([
		db.article.findMany({
			where,
			skip,
			take: limit,
			orderBy: { updatedAt: 'desc' },
			include: {
				tags: true,
				author: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		}),
		db.article.count({ where }),
	]);

	// If preview is true, truncate content to first 500 characters
	if (preview) {
		return {
			articles: articles.map((article) => ({
				...article,
				content:
					article.content.length > 500
						? article.content.substring(0, 500) + '...'
						: article.content,
				readingTime: estimateReadingTime(article.content),
			})),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	return {
		articles: articles.map((article) => ({
			...article,
			readingTime: estimateReadingTime(article.content),
		})),
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};
}

export async function getPublishedArticleBySlug(slug: string) {
	const article = await db.article.findUnique({
		where: {
			slug,
			isDraft: false,
		},
		include: {
			tags: true,
			author: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	if (article) {
		return {
			...article,
			readingTime: estimateReadingTime(article.content),
		};
	}

	return null;
}

export async function getPublishedArticlesByTag(
	tagName: string,
	page = 1,
	limit = 10
) {
	const skip = (page - 1) * limit;

	const [articles, total] = await Promise.all([
		db.article.findMany({
			where: {
				isDraft: false,
				tags: {
					some: {
						name: tagName,
					},
				},
			},
			skip,
			take: limit,
			orderBy: { updatedAt: 'desc' },
			include: {
				tags: true,
				author: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		}),
		db.article.count({
			where: {
				isDraft: false,
				tags: {
					some: {
						name: tagName,
					},
				},
			},
		}),
	]);

	return {
		articles: articles.map((article) => ({
			...article,
			readingTime: estimateReadingTime(article.content),
		})),
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};
}
