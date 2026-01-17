import { Elysia } from 'elysia';

import { generateRSS } from '../services/rss';

export const rssRoutes = new Elysia({ prefix: '/rss' }).get(
	'/',
	async ({ request, set }) => {
		const url = new URL(request.url);
		const baseUrl = `${url.protocol}//${url.host}`;
		const rss = await generateRSS(baseUrl);
		set.headers['Content-Type'] = 'text/xml; charset=utf-8';
		set.headers['Cache-Control'] = 'public, max-age=3600';
		return rss;
	},
	{
		detail: {
			description: '生成RSS订阅源',
			tags: ['RSS'],
		},
	}
);
