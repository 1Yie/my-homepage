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

// Project schemas
export const createProjectSchema = t.Object({
	name: t.String(),
	description: t.String(),
	tags: t.Array(t.String()),
	imageUrl: t.Optional(t.String()),
	githubUrl: t.Optional(t.String()),
	liveUrl: t.Optional(t.String()),
	order: t.Optional(t.Number()),
});

export const updateProjectSchema = t.Object({
	name: t.Optional(t.String()),
	description: t.Optional(t.String()),
	tags: t.Optional(t.Array(t.String())),
	imageUrl: t.Optional(t.String()),
	githubUrl: t.Optional(t.String()),
	liveUrl: t.Optional(t.String()),
	order: t.Optional(t.Number()),
});

// Slide schemas
export const createSlideSchema = t.Object({
	title: t.String(),
	src: t.String(),
	button: t.Optional(t.String()),
	link: t.Optional(t.String()),
	newTab: t.Optional(t.Boolean()),
	order: t.Optional(t.Number()),
});

export const updateSlideSchema = t.Object({
	title: t.Optional(t.String()),
	src: t.Optional(t.String()),
	button: t.Optional(t.String()),
	link: t.Optional(t.String()),
	newTab: t.Optional(t.Boolean()),
	order: t.Optional(t.Number()),
});
