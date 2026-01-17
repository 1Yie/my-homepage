import { Elysia } from 'elysia';
import { SitemapStream, streamToPromise } from 'sitemap';

import {
	getArticlesForSitemap,
	getTagsWithArticlesForSitemap,
} from '../services/sitemap';

const SITE_URL = process.env.FRONTEND_URL || 'https://i.in';

export const sitemapRoutes = new Elysia({ prefix: '/sitemap' })
	.get(
		'/',
		async ({ set }) => {
			try {
				set.headers['Content-Type'] = 'application/xml';

				const smStream = new SitemapStream({ hostname: SITE_URL });

				const staticPages = [
					{ url: '/', changefreq: 'daily', priority: 1.0 },
					{ url: '/blog', changefreq: 'daily', priority: 0.9 },
					{ url: '/about', changefreq: 'monthly', priority: 0.7 },
					{ url: '/archive', changefreq: 'weekly', priority: 0.7 },
					{ url: '/links', changefreq: 'weekly', priority: 0.6 },
					{ url: '/tags', changefreq: 'weekly', priority: 0.6 },
				];
				staticPages.forEach((page) => smStream.write(page));

				const articles = await getArticlesForSitemap();
				articles.forEach((article) => {
					smStream.write({
						url: `/blog/${article.slug}`,
						lastmod: article.updatedAt.toISOString(),
						changefreq: 'weekly',
						priority: 0.8,
					});
				});

				const tags = await getTagsWithArticlesForSitemap();
				tags.forEach((tag) => {
					const latestUpdate = tag.articles[0]?.updatedAt.toISOString();
					smStream.write({
						url: `/tags/${encodeURIComponent(tag.name)}`,
						lastmod: latestUpdate,
						changefreq: 'weekly',
						priority: 0.6,
					});
				});

				const sitemapPromise = streamToPromise(smStream);
				smStream.end();

				const sitemapXml = await sitemapPromise;
				return sitemapXml.toString();
			} catch (error) {
				console.error('Failed to generate XML sitemap:', error);
				set.status = 500;
				return 'Error generating sitemap';
			}
		},
		{
			detail: {
				description: '生成XML格式的站点地图',
				tags: ['站点地图'],
			},
		}
	)
	.get(
		'/	',
		async () => {
			const articles = await getArticlesForSitemap();
			return {
				success: true,
				data: articles.map((a) => ({
					...a,
					url: `${SITE_URL}/blog/${a.slug}`,
				})),
			};
		},
		{
			detail: {
				description: '获取站点文章列表',
				tags: ['站点地图'],
			},
		}
	)
	.get(
		'/tags',
		async () => {
			const tags = await getTagsWithArticlesForSitemap();
			return {
				success: true,
				data: tags.map((t) => ({
					...t,
					url: `${SITE_URL}/tags/${encodeURIComponent(t.name)}`,
				})),
			};
		},
		{
			detail: {
				description: '获取站点标签列表',
				tags: ['站点地图'],
			},
		}
	);
