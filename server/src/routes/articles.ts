import { Elysia, t } from 'elysia';

import { auth } from '../lib/auth';
import { authMiddleware } from '../lib/auth-middleware';
import { createArticleSchema, updateArticleSchema } from '../lib/schema';
import {
	createArticle,
	updateArticle,
	deleteArticle,
	getArticle,
	getArticlesByAuthor,
	getPublishedArticles,
} from '../services/articles';

export const articlesRoutes = new Elysia()
	.use(authMiddleware)
	.post(
		'/articles',
		async ({ body, user }) => {
			const article = await createArticle(body, user.id);
			return { success: true, data: article };
		},
		{
			body: createArticleSchema,
			auth: true,
		}
	)
	.put(
		'/articles/:id',
		async ({ params, body, user }) => {
			const article = await updateArticle(Number(params.id), body, user.id);
			return { success: true, data: article };
		},
		{
			params: t.Object({ id: t.String() }),
			body: updateArticleSchema,
			auth: true,
		}
	)
	.delete(
		'/articles/:id',
		async ({ params, user }) => {
			await deleteArticle(Number(params.id), user.id);
			return { success: true };
		},
		{
			params: t.Object({ id: t.String() }),
			auth: true,
		}
	)
	.get(
		'/articles/:id',
		async ({ params }) => {
			const article = await getArticle(Number(params.id));
			if (!article) throw new Error('Article not found');
			return { success: true, data: article };
		},
		{
			params: t.Object({ id: t.String() }),
			auth: true,
		}
	)
	.get(
		'/articles',
		async ({ query, request }) => {
			if (query.public === 'true') {
				const articles = await getPublishedArticles();
				return { success: true, data: articles };
			} else {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session) throw new Error('Unauthorized');
				const articles = await getArticlesByAuthor(session.user.id);
				return { success: true, data: articles };
			}
		},
		{
			query: t.Optional(t.Object({ public: t.Optional(t.String()) })),
		}
	);
