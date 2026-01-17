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

export const tagsRoutes = new Elysia({ prefix: '/tags' })
	.use(authMiddleware)

	.get(
		'/',
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
					public: t.Optional(
						t.String({
							description: '是否获取公开标签，值为"true"时包含文章信息',
						})
					),
				})
			),
			detail: {
				description: '获取标签列表 - 公开或包含文章计数',
				tags: ['标签'],
			},
		}
	)

	.get(
		'/:id',
		async ({ params }) => {
			const tag = await getTagById(Number(params.id));
			if (!tag) throw new Error('Tag not found');
			return { success: true, data: tag };
		},
		{
			params: t.Object({ id: t.String({ description: '标签ID' }) }),
			detail: {
				description: '根据ID获取单个标签信息',
				tags: ['标签'],
			},
		}
	)

	.post(
		'/',
		async ({ body }) => {
			const tag = await createTag(body);
			return { success: true, data: tag };
		},
		{
			body: tagSchema,
			auth: true,
			security: [{ BearerAuth: [] }],
			detail: {
				description: '创建新标签（需要用户认证）',
				tags: ['标签'],
			},
		}
	)

	.put(
		'/:id',
		async ({ params, body }) => {
			const tag = await updateTag(Number(params.id), body);
			return { success: true, data: tag };
		},
		{
			params: t.Object({ id: t.String({ description: '标签ID' }) }),
			body: tagSchema,
			auth: true,
			detail: {
				description: '更新指定ID的标签信息（需要用户认证）',
				tags: ['标签'],
			},
		}
	)

	.delete(
		'/:id',
		async ({ params }) => {
			await deleteTag(Number(params.id));
			return { success: true };
		},
		{
			params: t.Object({ id: t.String({ description: '标签ID' }) }),
			auth: true,
			detail: {
				description: '删除指定ID的标签（需要用户认证）',
				tags: ['标签'],
			},
		}
	)

	.post(
		'/batch-delete',
		async ({ body }) => {
			const result = await deleteTagsBatch(body.ids);
			return { success: true, data: result };
		},
		{
			body: t.Object({
				ids: t.Array(t.Number({ description: '批量标签ID' })),
			}),
			auth: true,
			detail: {
				description: '批量删除多个标签（需要用户认证）',
				tags: ['标签'],
			},
		}
	);
