/**
 * Artalk 评论系统服务
 * 从自托管的 Artalk 实例获取评论统计数据
 *
 * API 文档参考：
 *   GET /api/v2/stats/{type}
 *   类型: site_comment, latest_comments, comment_most_pages, site_pv, latest_pages
 */

const ARTALK_SERVER_URL =
	process.env.ARTALK_SERVER_URL || 'https://artalk.ichiyo.in';
const ARTALK_SITE_NAME = process.env.ARTALK_SITE_NAME || 'ichiyo.in Artalk';

/** Artalk 评论对象 */
export interface ArtalkComment {
	id: number;
	content: string;
	content_marked: string;
	user_id: number;
	nick: string;
	email_encrypted: string;
	link: string;
	ua: string;
	date: string;
	is_collapsed: boolean;
	is_pending: boolean;
	is_pinned: boolean;
	is_allow_reply: boolean;
	is_verified: boolean;
	rid: number;
	badge_name: string;
	badge_color: string;
	visible: boolean;
	vote_up: number;
	vote_down: number;
	page_key: string;
	page_url: string;
	site_name: string;
}

/** Artalk 页面对象 */
export interface ArtalkPage {
	id: number;
	admin_only: boolean;
	key: string;
	url: string;
	title: string;
	site_name: string;
	vote_up: number;
	vote_down: number;
	pv: number;
	date: string;
}

/** 完整的评论详情（用于评论管理页面） */
export interface ArtalkCommentDetail {
	id: number;
	nick: string;
	content: string;
	contentMarked: string;
	/** 邮箱 SHA256 哈希，可用于生成 Gravatar 头像 */
	emailEncrypted: string;
	date: string;
	pageKey: string;
	pageUrl: string;
	link: string;
	ua: string;
	isPending: boolean;
	isPinned: boolean;
	isVerified: boolean;
	voteUp: number;
	voteDown: number;
	rid: number;
	badgeName: string;
	badgeColor: string;
}

/** 评论统计数据聚合 */
export interface ArtalkStats {
	/** 站点总评论数 */
	totalComments: number;
	/** 最新评论列表 */
	latestComments: Array<{
		id: number;
		nick: string;
		content: string;
		/** 邮箱 SHA256 哈希，可用于生成 Gravatar 头像 */
		emailEncrypted: string;
		date: string;
		pageKey: string;
		pageUrl: string;
	}>;
	/** 评论最多的页面列表 */
	topCommentedPages: Array<{
		id: number;
		title: string;
		key: string;
		url: string;
		pv: number;
		/** 真实评论数 */
		commentCount: number;
		date: string;
	}>;
}

/**
 * 调用 Artalk stats API
 * @param type - 统计类型
 * @param limit - 返回条数限制
 */
async function fetchArtalkStats<T>(type: string, limit = 5): Promise<T | null> {
	try {
		const url = new URL(`${ARTALK_SERVER_URL}/api/v2/stats/${type}`);
		url.searchParams.set('site_name', ARTALK_SITE_NAME);
		url.searchParams.set('limit', String(limit));

		const response = await fetch(url.toString(), {
			headers: {
				Accept: 'application/json',
			},
			// 5 秒超时
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			console.error(`[Artalk] 请求失败: ${type} ${response.status}`);
			return null;
		}

		const json = await response.json();
		return json.data as T;
	} catch (error) {
		console.error(`[Artalk] 请求异常: ${type}`, error);
		return null;
	}
}

/**
 * 获取 Artalk 评论列表（完整详情）
 * @param limit - 最大返回条数 (默认 50，最大 100)
 */
export async function getArtalkCommentList(
	limit = 50
): Promise<ArtalkCommentDetail[]> {
	const comments = await fetchArtalkStats<ArtalkComment[]>(
		'latest_comments',
		Math.min(limit, 100)
	);

	return (comments ?? []).map((c) => ({
		id: c.id,
		nick: c.nick,
		content: c.content,
		contentMarked: c.content_marked,
		emailEncrypted: c.email_encrypted,
		date: c.date,
		pageKey: c.page_key,
		pageUrl: c.page_url,
		link: c.link,
		ua: c.ua,
		isPending: c.is_pending,
		isPinned: c.is_pinned,
		isVerified: c.is_verified,
		voteUp: c.vote_up,
		voteDown: c.vote_down,
		rid: c.rid,
		badgeName: c.badge_name,
		badgeColor: c.badge_color,
	}));
}

/**
 * 获取指定页面的评论数
 * @param pageKeys - 页面 key 列表
 */
async function fetchPageCommentCounts(
	pageKeys: string[]
): Promise<Record<string, number>> {
	if (pageKeys.length === 0) return {};

	try {
		const url = new URL(`${ARTALK_SERVER_URL}/api/v2/stats/page_comment`);
		url.searchParams.set('site_name', ARTALK_SITE_NAME);
		url.searchParams.set('page_keys', pageKeys.join(','));

		const response = await fetch(url.toString(), {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			console.error(`[Artalk] page_comment 请求失败: ${response.status}`);
			return {};
		}

		const json = await response.json();
		return (json.data as Record<string, number>) ?? {};
	} catch (error) {
		console.error('[Artalk] page_comment 请求异常:', error);
		return {};
	}
}

/**
 * 获取 Artalk 综合统计数据
 */
export async function getArtalkStats(): Promise<ArtalkStats> {
	const [totalComments, latestComments, topCommentedPages] = await Promise.all([
		fetchArtalkStats<number>('site_comment'),
		fetchArtalkStats<ArtalkComment[]>('latest_comments', 6),
		fetchArtalkStats<ArtalkPage[]>('comment_most_pages', 5),
	]);

	const pages = topCommentedPages ?? [];
	const commentCounts =
		pages.length > 0
			? await fetchPageCommentCounts(pages.map((p) => p.key))
			: {};

	return {
		totalComments: totalComments ?? 0,
		latestComments: (latestComments ?? []).map((c) => ({
			id: c.id,
			nick: c.nick,
			content: c.content,
			emailEncrypted: c.email_encrypted,
			date: c.date,
			pageKey: c.page_key,
			pageUrl: c.page_url,
		})),
		topCommentedPages: pages.map((p) => ({
			id: p.id,
			title: p.title,
			key: p.key,
			url: p.url,
			pv: p.pv,
			commentCount: commentCounts[p.key] ?? 0,
			date: p.date,
		})),
	};
}
