import { Elysia, t } from 'elysia';

import { authMiddleware } from '../lib/auth-middleware';
import { tagSchema } from '../lib/schema';
import {
	createTag,
	deleteTag,
	deleteTagsBatch,
	getTagById,
	getTagsWithCount,
	updateTag,
} from '../services/tags';

export const tagsRoutes = new Elysia({ prefix: '/tags' })
	.use(authMiddleware)
	// GET /tags - 获取所有标签（带文章数量）
	.get('/', async () => {
		try {
			const tags = await getTagsWithCount();
			return {
				success: true,
				data: tags,
			};
		} catch (error) {
			console.error('Failed to get tags:', error);
			return {
				success: false,
				error: 'Failed to fetch tags',
			};
		}
	})

	// GET /tags/:id - 获取单个标签
	.get('/:id', async ({ params }) => {
		try {
			const id = Number(params.id);
			const tag = await getTagById(id);

			if (!tag) {
				return {
					success: false,
					error: 'Tag not found',
				};
			}

			return {
				success: true,
				data: tag,
			};
		} catch (error) {
			console.error('Failed to get tag:', error);
			return {
				success: false,
				error: 'Failed to fetch tag',
			};
		}
	})

	// POST /tags - 创建标签（需要认证）
	.post(
		'/',
		async ({ body }) => {
			try {
				const tag = await createTag(body);
				return {
					success: true,
					data: tag,
				};
			} catch (error) {
				console.error('Failed to create tag:', error);
				return {
					success: false,
					error:
						error instanceof Error ? error.message : 'Failed to create tag',
				};
			}
		},
		{
			body: tagSchema,
			auth: true,
		}
	)

	// PUT /tags/:id - 更新标签（需要认证）
	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const id = Number(params.id);
				const tag = await updateTag(id, body);
				return {
					success: true,
					data: tag,
				};
			} catch (error) {
				console.error('Failed to update tag:', error);
				return {
					success: false,
					error:
						error instanceof Error ? error.message : 'Failed to update tag',
				};
			}
		},
		{
			body: tagSchema,
			auth: true,
		}
	)

	// DELETE /tags/:id - 删除标签（需要认证）
	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const id = Number(params.id);
				await deleteTag(id);
				return {
					success: true,
					message: 'Tag deleted successfully',
				};
			} catch (error) {
				console.error('Failed to delete tag:', error);
				return {
					success: false,
					error:
						error instanceof Error ? error.message : 'Failed to delete tag',
				};
			}
		},
		{
			auth: true,
		}
	)

	// POST /tags/batch-delete - 批量删除标签（需要认证）
	.post(
		'/batch-delete',
		async ({ body }) => {
			try {
				const result = await deleteTagsBatch(body.ids);
				return {
					success: true,
					data: result,
				};
			} catch (error) {
				console.error('Failed to batch delete tags:', error);
				return {
					success: false,
					error: 'Failed to delete tags',
				};
			}
		},
		{
			body: t.Object({
				ids: t.Array(t.Number()),
			}),
			auth: true,
		}
	);
