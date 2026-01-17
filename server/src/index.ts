import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { type Context, Elysia } from 'elysia';

import { auth } from './lib/auth';
import { articlesRoutes } from './routes/articles';
import { dashboardRoutes } from './routes/dashboard';
import { friendsRoutes } from './routes/friends';
import { projectsRoutes } from './routes/projects';
import { rssRoutes } from './routes/rss';
import { sitemapRoutes } from './routes/sitemap';
import { slidesRoutes } from './routes/slides';
import { tagsRoutes } from './routes/tags';

const betterAuthView = async (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];
	if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
		const response = await auth.handler(context.request);
		return response;
	} else {
		return new Response('Method Not Allowed', { status: 405 });
	}
};

const PORT = Number(process.env.PORT) || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

const app = new Elysia()
	.use(
		swagger({
			documentation: {
				info: {
					title: 'Ichiyo.in API',
					version: '1.0.0',
					description:
						'ichiyo.in 博客平台的API文档，提供文章、项目、友链、标签、轮播图片等功能的RESTful API接口。支持用户认证、内容管理和数据检索等功能。',
				},
			},
		})
	)
	.use(
		cors({
			origin: process.env.FRONTEND_URL || 'http://localhost:5173',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Cookie'],
		})
	)
	.all('/api/auth/*', betterAuthView)
	.group('/api', (api) =>
		api
			.group('/v1', (v1) =>
				v1
					.use(tagsRoutes)
					.use(articlesRoutes)
					.use(projectsRoutes)
					.use(slidesRoutes)
					.use(friendsRoutes)
					.use(dashboardRoutes)
			)
			.use(sitemapRoutes)
			.use(rssRoutes)
	)
	.listen({
		port: PORT,
		hostname: HOSTNAME,
	});

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
