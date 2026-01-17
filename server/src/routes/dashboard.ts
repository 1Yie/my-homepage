import { Elysia } from 'elysia';

import { getDashboardStats } from '../services/dashboard';

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' }).get(
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
);
