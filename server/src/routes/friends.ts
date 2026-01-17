import { Elysia, t } from 'elysia';

import { authMiddleware } from '../lib/auth-middleware';
import { createFriendSchema, updateFriendSchema } from '../lib/schema';
import {
	getFriends,
	getFriendById,
	createFriend,
	updateFriend,
	deleteFriend,
} from '../services/friends';

export const friendsRoutes = new Elysia({ prefix: '/friends' })
	.use(authMiddleware)
	.get(
		'/',
		async () => {
			try {
				const friends = await getFriends();
				return {
					success: true,
					data: friends,
				};
			} catch (error) {
				console.error('Failed to get friends:', error);
				return {
					success: false,
					error: 'Failed to fetch friends',
				};
			}
		},
		{
			detail: {
				description: '获取所有友链列表',
				tags: ['友链'],
			},
		}
	)

	.get(
		'/:id',
		async ({ params }) => {
			try {
				const id = Number(params.id);
				const friend = await getFriendById(id);

				if (!friend) {
					return {
						success: false,
						error: 'Friend not found',
					};
				}

				return {
					success: true,
					data: friend,
				};
			} catch (error) {
				console.error('Failed to get friend:', error);
				return {
					success: false,
					error: 'Failed to fetch friend',
				};
			}
		},
		{
			params: t.Object({ id: t.String({ description: '友链ID' }) }),
			detail: {
				description: '根据ID获取单个友链信息',
				tags: ['友链'],
			},
		}
	)

	.post(
		'/',
		async ({ body }) => {
			try {
				const friend = await createFriend(body);
				return {
					success: true,
					data: friend,
				};
			} catch (error) {
				console.error('Failed to create friend:', error);
				return {
					success: false,
					error:
						error instanceof Error ? error.message : 'Failed to create friend',
				};
			}
		},
		{
			body: createFriendSchema,
			auth: true,
			security: [{ BearerAuth: [] }],
			detail: {
				description: '创建新的友链（需要用户认证）',
				tags: ['友链'],
			},
		}
	)

	.put(
		'/:id',
		async ({ params, body }) => {
			try {
				const id = Number(params.id);
				const friend = await updateFriend(id, body);
				return {
					success: true,
					data: friend,
				};
			} catch (error) {
				console.error('Failed to update friend:', error);
				return {
					success: false,
					error:
						error instanceof Error ? error.message : 'Failed to update friend',
				};
			}
		},
		{
			params: t.Object({ id: t.String({ description: '友链ID' }) }),
			body: updateFriendSchema,
			auth: true,
			detail: {
				description: '更新指定ID的友链信息（需要用户认证）',
				tags: ['友链'],
			},
		}
	)

	.delete(
		'/:id',
		async ({ params }) => {
			try {
				const id = Number(params.id);
				await deleteFriend(id);
				return {
					success: true,
					message: 'Friend deleted successfully',
				};
			} catch (error) {
				console.error('Failed to delete friend:', error);
				return {
					success: false,
					error:
						error instanceof Error ? error.message : 'Failed to delete friend',
				};
			}
		},
		{
			params: t.Object({ id: t.String({ description: '友链ID' }) }),
			auth: true,
			detail: {
				description: '删除指定ID的友链（需要用户认证）',
				tags: ['友链'],
			},
		}
	);
