import { cors } from '@elysiajs/cors';
import { Elysia, Context } from 'elysia';

import { auth } from './lib/auth';
import { articlesRoutes } from './routes/articles';

const betterAuthView = async (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];
	if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
		// 必须等待 handler 执行完成
		const response = await auth.handler(context.request);
		return response;
	} else {
		return new Response('Method Not Allowed', { status: 405 });
	}
};

const PORT = Number(Bun.env.PORT) || 3000;
const HOSTNAME = Bun.env.HOSTNAME || 'localhost';

const app = new Elysia()
	.use(
		cors({
			origin: process.env.FRONTEND_URL || 'http://localhost:5173',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Cookie'],
		})
	)
	.all('/api/auth/*', betterAuthView)
	.use(articlesRoutes)
	.get('/', () => ({
		message: 'Hello Elysia',
		status: 'running',
	}))
	.listen({
		port: PORT,
		hostname: HOSTNAME,
	});

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
