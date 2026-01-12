import type { createArticleSchema, updateArticleSchema } from '../lib/schema';

import { prisma } from '../lib/db';

export async function createArticle(
	data: typeof createArticleSchema.static,
	authorId: string
) {
	const { tagIds, ...articleData } = data;
	return prisma.article.create({
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
	return prisma.article.update({
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
	return prisma.article.delete({
		where: {
			id,
			authorId,
		},
	});
}

export async function getArticle(id: number) {
	return prisma.article.findUnique({
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

export async function getArticlesByAuthor(authorId: string) {
	return prisma.article.findMany({
		where: { authorId },
		include: {
			tags: true,
		},
	});
}

export async function getPublishedArticles() {
	return prisma.article.findMany({
		where: { isDraft: false },
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
