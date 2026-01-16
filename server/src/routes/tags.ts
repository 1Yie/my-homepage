import { Elysia, t } from 'elysia';

import { auth } from '../lib/auth';
import { authMiddleware } from '../lib/auth-middleware';
import { tagSchema } from '../lib/schema';
import {
	createTag,
	deleteTag,
	deleteTagsBatch,
	getTagById,
	getTagsWithCount,
	updateTag,
	getTagsWithArticles,
} from '../services/tags';

export const tagsRoutes = new Elysia()
	.use(authMiddleware)

	.get(
		'/tags',
		async ({ query, request }) => {
			if (query.public === 'true') {
				const tags = await getTagsWithArticles();
				return { success: true, data: tags };
			}

			const session = await auth.api.getSession({
				headers: request.headers,
			});
			if (!session) {
				throw new Error('Unauthorized');
			}

			const tags = await getTagsWithCount();
			return { success: true, data: tags };
		},
		{
			query: t.Optional(
				t.Object({
					public: t.Optional(t.String()),
				})
			),
		}
	)

	.get(
		'/tags/:id',
		async ({ params }) => {
			const tag = await getTagById(Number(params.id));
			if (!tag) throw new Error('Tag not found');
			return { success: true, data: tag };
		},
		{
			params: t.Object({ id: t.String() }),
		}
	)

	.post(
		'/tags',
		async ({ body }) => {
			const tag = await createTag(body);
			return { success: true, data: tag };
		},
		{
			body: tagSchema,
			auth: true,
		}
	)

	.put(
		'/tags/:id',
		async ({ params, body }) => {
			const tag = await updateTag(Number(params.id), body);
			return { success: true, data: tag };
		},
		{
			body: tagSchema,
			auth: true,
		}
	)

	.delete(
		'/tags/:id',
		async ({ params }) => {
			await deleteTag(Number(params.id));
			return { success: true };
		},
		{
			auth: true,
		}
	)

	.post(
		'/tags/batch-delete',
		async ({ body }) => {
			const result = await deleteTagsBatch(body.ids);
			return { success: true, data: result };
		},
		{
			body: t.Object({
				ids: t.Array(t.Number()),
			}),
			auth: true,
		}
	);
