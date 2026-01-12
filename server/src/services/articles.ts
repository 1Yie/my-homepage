import type { createArticleSchema, updateArticleSchema } from '../lib/schema';

import { Prisma } from '../../prisma/generated/prisma/client';
import { db } from '../lib/db';

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
			authorId, // ensure only author can update
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

export async function getPublishedArticles(search?: string) {
	const where: Prisma.ArticleWhereInput = { isDraft: false };
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
			author: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});
}
