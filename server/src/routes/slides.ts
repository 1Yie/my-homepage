import { Elysia, t } from 'elysia';

import { authMiddleware } from '../lib/auth-middleware';
import { createSlideSchema, updateSlideSchema } from '../lib/schema';
import {
	getSlides,
	getSlide,
	createSlide,
	updateSlide,
	deleteSlide,
} from '../services/slides';

export const slidesRoutes = new Elysia({ prefix: '/slides' })
	.use(authMiddleware)
	.get(
		'/',
		async () => {
			const slides = await getSlides();
			return { success: true, data: slides };
		},
		{
			detail: {
				description: '获取所有轮播图列表',
				tags: ['轮播图'],
			},
		}
	)
	.get(
		'/:id',
		async ({ params }) => {
			const slide = await getSlide(Number(params.id));
			if (!slide) throw new Error('Slide not found');
			return { success: true, data: slide };
		},
		{
			params: t.Object({ id: t.String({ description: '轮播图ID' }) }),
			detail: {
				description: '根据ID获取单个轮播图信息',
				tags: ['轮播图'],
			},
		}
	)
	.post(
		'/',
		async ({ body }) => {
			const slide = await createSlide(body);
			return { success: true, data: slide };
		},
		{
			body: createSlideSchema,
			auth: true,
			security: [{ BearerAuth: [] }],
			detail: {
				description: '创建新轮播图（需要用户认证）',
				tags: ['轮播图'],
			},
		}
	)
	.put(
		'/:id',
		async ({ params, body }) => {
			const slide = await updateSlide(Number(params.id), body);
			return { success: true, data: slide };
		},
		{
			params: t.Object({ id: t.String({ description: '轮播图ID' }) }),
			body: updateSlideSchema,
			auth: true,
			detail: {
				description: '更新指定ID的轮播图信息（需要用户认证）',
				tags: ['轮播图'],
			},
		}
	)
	.delete(
		'/:id',
		async ({ params }) => {
			await deleteSlide(Number(params.id));
			return { success: true };
		},
		{
			params: t.Object({ id: t.String({ description: '轮播图ID' }) }),
			auth: true,
			detail: {
				description: '删除指定ID的轮播图（需要用户认证）',
				tags: ['轮播图'],
			},
		}
	);
