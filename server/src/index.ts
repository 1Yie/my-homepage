import { Elysia } from 'elysia';

const PORT = Number(Bun.env.PORT);
const HOSTNAME = Bun.env.HOSTNAME;

const app = new Elysia()
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
