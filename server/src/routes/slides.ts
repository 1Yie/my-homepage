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

export const slidesRoutes = new Elysia()
	.use(authMiddleware)
	.get('/slides', async () => {
		const slides = await getSlides();
		return { success: true, data: slides };
	})
	.get(
		'/slides/:id',
		async ({ params }) => {
			const slide = await getSlide(Number(params.id));
			if (!slide) throw new Error('Slide not found');
			return { success: true, data: slide };
		},
		{
			params: t.Object({ id: t.String() }),
		}
	)
	.post(
		'/slides',
		async ({ body }) => {
			const slide = await createSlide(body);
			return { success: true, data: slide };
		},
		{
			body: createSlideSchema,
			auth: true,
		}
	)
	.put(
		'/slides/:id',
		async ({ params, body }) => {
			const slide = await updateSlide(Number(params.id), body);
			return { success: true, data: slide };
		},
		{
			params: t.Object({ id: t.String() }),
			body: updateSlideSchema,
			auth: true,
		}
	)
	.delete(
		'/slides/:id',
		async ({ params }) => {
			await deleteSlide(Number(params.id));
			return { success: true };
		},
		{
			params: t.Object({ id: t.String() }),
			auth: true,
		}
	);
