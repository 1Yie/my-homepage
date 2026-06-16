import { Elysia } from 'elysia';

import { getArtalkCommentList } from '../services/artalk';
import { getDashboardStats } from '../services/dashboard';

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
	.get(
		'/stats',
		async () => {
			try {
				const stats = await getDashboardStats();
				return {
					success: true,
					data: stats,
				};
			} catch (error) {
				console.error('Failed to get dashboard stats:', error);
				return {
					success: false,
					error: 'Failed to fetch dashboard statistics',
				};
			}
		},
		{
			detail: {
				description: '获取仪表盘统计数据',
				tags: ['仪表盘'],
			},
		}
	)
	.get(
		'/comments',
		async () => {
			try {
				const comments = await getArtalkCommentList(50);
				return {
					success: true,
					data: comments,
				};
			} catch (error) {
				console.error('Failed to fetch comments:', error);
				return {
					success: false,
					error: '获取评论列表失败',
				};
			}
		},
		{
			detail: {
				description: '获取 Artalk 评论列表',
				tags: ['仪表盘'],
			},
		}
	);
