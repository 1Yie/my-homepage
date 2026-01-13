import { Elysia, t } from 'elysia';

import { auth } from '../lib/auth';
import { authMiddleware } from '../lib/auth-middleware';
import {
	createArticleSchema,
	updateArticleSchema,
	tagSchema,
} from '../lib/schema';
import {
	createArticle,
	updateArticle,
	deleteArticle,
	getArticle,
	getArticlesByAuthor,
	getPublishedArticles,
	getPublishedArticleBySlug,
	getTags,
	createTag,
	getPublishedArticlesByTag,
	generateRSS,
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
				const page = parseInt(query.page || '1');
				const limit = parseInt(query.limit || '10');
				const articles = await getPublishedArticles(
					query.q,
					query.preview === 'true',
					page,
					limit
				);
				return { success: true, data: articles };
			} else {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session) throw new Error('Unauthorized');
				const articles = await getArticlesByAuthor(session.user.id, query.q);
				return { success: true, data: articles };
			}
		},
		{
			query: t.Optional(
				t.Object({
					public: t.Optional(t.String()),
					q: t.Optional(t.String()),
					preview: t.Optional(t.String()),
					page: t.Optional(t.String()),
					limit: t.Optional(t.String()),
				})
			),
		}
	)
	.get(
		'/articles/slug/:slug',
		async ({ params }) => {
			const article = await getPublishedArticleBySlug(params.slug);
			if (!article) throw new Error('Article not found');
			return { success: true, data: article };
		},
		{
			params: t.Object({ slug: t.String() }),
		}
	)
	.get('/tags', async () => {
		const tags = await getTags();
		return { success: true, data: tags };
	})
	.post(
		'/tags',
		async ({ body }) => {
			const tag = await createTag(body);
			return { success: true, data: tag };
		},
		{
			body: tagSchema,
		}
	)
	.get(
		'/articles/tag/:tagName',
		async ({ params, query }) => {
			const page = parseInt(query.page || '1');
			const limit = parseInt(query.limit || '10');
			const articles = await getPublishedArticlesByTag(
				decodeURIComponent(params.tagName),
				page,
				limit
			);
			return { success: true, data: articles };
		},
		{
			params: t.Object({ tagName: t.String() }),
			query: t.Optional(
				t.Object({
					page: t.Optional(t.String()),
					limit: t.Optional(t.String()),
				})
			),
		}
	)
	.get('/rss', async ({ request, set }) => {
		const url = new URL(request.url);
		const baseUrl = `${url.protocol}//${url.host}`;
		const rss = await generateRSS(baseUrl);
		set.headers['Content-Type'] = 'text/xml; charset=utf-8';
		set.headers['Cache-Control'] = 'public, max-age=3600';
		return rss;
	});
