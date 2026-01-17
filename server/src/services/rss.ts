import { Feed } from 'feed';

import { db } from '../lib/db';

export async function generateRSS(baseUrl: string) {
	const articles = await db.article.findMany({
		where: { isDraft: false },
		orderBy: { updatedAt: 'desc' },
		include: {
			tags: true,
			author: {
				select: {
					name: true,
				},
			},
		},
	});

	const getYear = new Date().getFullYear();

	const feed = new Feed({
		title: 'ichiyo.in Blog',
		description: '记录 / 分享 / 唠嗑 / 闲聊 / ichiyo (@1Yie)',
		id: baseUrl,
		link: baseUrl,
		language: 'zh-cn',
		copyright: `All rights reserved ${getYear}, ichiyo.in`,
		updated: new Date(),
		generator: 'ichiyo.in',
		feedLinks: {
			rss2: `${baseUrl}/api/rss`,
		},
		author: {
			name: 'ichiyo',
			link: baseUrl,
		},
	});

	articles.forEach((article) => {
		const description = article.content
			.replace(/<[^>]*>/g, '')
			.replace(/^#+\s*/gm, '')
			.replace(/\[[^\]]+\]\([^)]+\)/g, '$1')
			.replace(/[*_`]/g, '')
			.trim();

		const link = `${baseUrl}/blog/${article.slug}`;

		feed.addItem({
			title: article.title,
			id: link,
			link: link,
			description: description,
			content: article.content,
			author: [
				{
					name: article.author.name,
				},
			],
			date: article.updatedAt,
			category: article.tags.map((tag) => ({ name: tag.name })),
		});
	});

	return feed.rss2();
}
