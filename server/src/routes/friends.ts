import { Elysia } from 'elysia';

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
	// GET /friends - 获取所有友链（公开）
	.get('/', async () => {
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
	})

	// GET /friends/:id - 获取单个友链（公开）
	.get('/:id', async ({ params }) => {
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
	})

	// POST /friends - 创建友链（需要认证）
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
		}
	)

	// PUT /friends/:id - 更新友链（需要认证）
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
			body: updateFriendSchema,
			auth: true,
		}
	)

	// DELETE /friends/:id - 删除友链（需要认证）
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
			auth: true,
		}
	);
