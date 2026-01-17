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
	getPublishedArticleBySlug,
	getPublishedArticlesByTag,
} from '../services/articles';

export const articlesRoutes = new Elysia({ prefix: '/articles' })
	.use(authMiddleware)
	.post(
		'/',
		async ({ body, user }) => {
			const article = await createArticle(body, user.id);
			return { success: true, data: article };
		},
		{
			body: createArticleSchema,
			auth: true,
			detail: {
				description: '创建新文章（需要用户认证）',
				tags: ['文章'],
			},
		}
	)
	.put(
		'/:id',
		async ({ params, body, user }) => {
			const article = await updateArticle(Number(params.id), body, user.id);
			return { success: true, data: article };
		},
		{
			params: t.Object({ id: t.String({ description: '文章ID' }) }),
			body: updateArticleSchema,
			auth: true,
			detail: {
				description: '更新指定ID的文章信息（需要用户认证）',
				tags: ['文章'],
			},
		}
	)
	.delete(
		'/:id',
		async ({ params, user }) => {
			await deleteArticle(Number(params.id), user.id);
			return { success: true };
		},
		{
			params: t.Object({ id: t.String({ description: '文章ID' }) }),
			auth: true,
			detail: {
				description: '删除指定ID的文章（需要用户认证）',
				tags: ['文章'],
			},
		}
	)
	.get(
		'/:id',
		async ({ params }) => {
			const article = await getArticle(Number(params.id));
			if (!article) throw new Error('Article not found');
			return { success: true, data: article };
		},
		{
			params: t.Object({ id: t.String({ description: '文章ID' }) }),
			auth: true,
			detail: {
				description: '根据ID获取单个文章信息（需要用户认证）',
				tags: ['文章'],
			},
		}
	)
	.get(
		'/',
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
					public: t.Optional(
						t.String({
							description: '是否获取公开文章，值为"true"时获取公开文章',
						})
					),
					q: t.Optional(
						t.String({ description: '搜索关键词，用于筛选文章标题和内容' })
					),
					preview: t.Optional(
						t.String({ description: '是否预览模式，值为"true"时包含草稿文章' })
					),
					page: t.Optional(t.String({ description: '页码，从1开始' })),
					limit: t.Optional(t.String({ description: '每页条数，默认10条' })),
				})
			),
			detail: {
				description: '获取文章列表 - 公开或用户特定文章',
				tags: ['文章'],
			},
		}
	)
	.get(
		'/slug/:slug',
		async ({ params, set }) => {
			const article = await getPublishedArticleBySlug(params.slug);
			if (!article) {
				set.status = 404;
				throw new Error('Article not found');
			}
			return { success: true, data: article };
		},
		{
			params: t.Object({ slug: t.String({ description: '文章的URL slug' }) }),
			detail: {
				description: '根据文章slug获取已发布文章',
				tags: ['文章'],
			},
		}
	)
	.get(
		'/tag/:tagName',
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
			params: t.Object({ tagName: t.String({ description: '标签名称' }) }),
			query: t.Optional(
				t.Object({
					page: t.Optional(t.String({ description: '页码，从1开始' })),
					limit: t.Optional(t.String({ description: '每页条数，默认10条' })),
				})
			),
			detail: {
				description: '根据标签名称获取已发布的文章',
				tags: ['文章'],
			},
		}
	);
