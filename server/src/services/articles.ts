import type { createArticleSchema, updateArticleSchema } from '../lib/schema';

import { Prisma } from '../../prisma/generated/prisma/client';
import { db } from '../lib/db';

const VIEW_TTL_MS = 1000 * 60 * 60; // 1 hour
const viewCache = new Map<string, number>();

function shouldCountView(
	articleId: number,
	visitorKey: string,
	ttl = VIEW_TTL_MS
) {
	try {
		const key = `${articleId}:${visitorKey}`;
		const now = Date.now();
		const last = viewCache.get(key);
		if (!last || now - last > ttl) {
			viewCache.set(key, now);
			return true;
		}
		return false;
	} catch (e) {
		console.log(e);
		return true;
	}
}

setInterval(() => {
	const now = Date.now();
	for (const [k, ts] of viewCache) {
		if (now - ts > VIEW_TTL_MS * 2) viewCache.delete(k);
	}
}, 1000 * 60);

function estimateReadingTime(content: string): number {
	const plainText = content
		.replace(/<[^>]*>/g, '')
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

export async function getPublishedArticleBySlug(
	slug: string,
	options?: { visitorKey?: string; ttlMs?: number }
) {
	const article = await db.article.findUnique({
		where: { slug },
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

	if (!article || article.isDraft) return null;

	const visitorKey = options?.visitorKey;
	const ttl = options?.ttlMs ?? VIEW_TTL_MS;

	if (visitorKey) {
		const should = shouldCountView(article.id, visitorKey, ttl);
		if (should) {
			const updated = await db.article.update({
				where: { id: article.id },
				data: { views: { increment: 1 } },
				include: {
					tags: true,
					author: {
						select: { id: true, name: true },
					},
				},
			});

			return {
				...updated,
				readingTime: estimateReadingTime(updated.content),
			};
		}
		// not counting this view; return current article (views included)
		return {
			...article,
			readingTime: estimateReadingTime(article.content),
		};
	}

	// No visitorKey provided: fallback to always increment
	const updated = await db.article.update({
		where: { id: article.id },
		data: { views: { increment: 1 } },
		include: {
			tags: true,
			author: { select: { id: true, name: true } },
		},
	});

	return {
		...updated,
		readingTime: estimateReadingTime(updated.content),
	};
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
