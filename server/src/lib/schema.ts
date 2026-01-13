import { t } from 'elysia';

export const createArticleSchema = t.Object({
	title: t.String(),
	slug: t.String(),
	content: t.String(),
	headerImage: t.Optional(t.String()),
	isDraft: t.Optional(t.Boolean()),
	tagIds: t.Optional(t.Array(t.Number())),
});

export const updateArticleSchema = t.Object({
	title: t.Optional(t.String()),
	slug: t.Optional(t.String()),
	content: t.Optional(t.String()),
	headerImage: t.Optional(t.String()),
	isDraft: t.Optional(t.Boolean()),
	tagIds: t.Optional(t.Array(t.Number())),
});

export const articleResponseSchema = t.Object({
	id: t.Number(),
	title: t.String(),
	slug: t.String(),
	content: t.String(),
	headerImage: t.Optional(t.String()),
	isDraft: t.Boolean(),
	createdAt: t.String(),
	updatedAt: t.String(),
	authorId: t.String(),
	tags: t.Array(
		t.Object({
			id: t.Number(),
			name: t.String(),
		})
	),
});

export const tagSchema = t.Object({
	name: t.String(),
});

export const tagResponseSchema = t.Object({
	id: t.Number(),
	name: t.String(),
});
