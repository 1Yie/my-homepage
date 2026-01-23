import { useEffect, useRef } from 'react';

export interface SeoOptions {
	/** 页面标题 */
	title?: string;
	/** 页面介绍 */
	description?: string;
	/** 关键词 */
	keywords?: string | string[];
	/** 社交媒体分享图 (Open Graph) */
	ogImage?: string;
	/** 内容类型，博客页面请传 'article'，默认 'website' */
	type?: 'website' | 'article' | 'blog';
	/** 文章发布时间 (ISO 8601 格式，如 article?.createdAt) */
	publishedTime?: string;
	/** 文章最后修改时间 (ISO 8601 格式，如 article?.updatedAt) */
	updatedTime?: string;
	/** 组件卸载时是否保留当前设置（默认 false） */
	preserve?: boolean;
	/** 是否保留 "| ichiyo" 后缀（默认 true） */
	hasSuffix?: boolean;
}

/**
 * 核心 SEO Hook
 * 支持标题、介绍、关键词、社交媒体标签及博客时间属性
 */
export function useSeo(options: SeoOptions) {
	const {
		title,
		description,
		keywords,
		ogImage,
		type = 'website',
		publishedTime,
		updatedTime,
		preserve = false,
		hasSuffix = true,
	} = options;

	// 记录初始值，用于组件卸载时还原
	const prevValues = useRef({
		title: typeof document !== 'undefined' ? document.title : '',
		description: getMeta('description'),
		keywords: getMeta('keywords'),
	});

	useEffect(() => {
		const baseTitle = 'ichiyo';
		let fullTitle = '';
		const separator = '\u00A0|\u00A0';

		// 1. 处理标题
		if (title !== undefined) {
			fullTitle =
				hasSuffix && title
					? `${title}${separator}${baseTitle}`
					: title || baseTitle;
			if (document.title !== fullTitle) {
				document.title = fullTitle;
			}
		}

		// 2. 基础 Meta 标签
		updateMeta('name', 'description', description);
		updateMeta(
			'name',
			'keywords',
			Array.isArray(keywords) ? keywords.join(', ') : keywords
		);

		// 3. Open Graph (社交媒体) 基础标签
		if (fullTitle) updateMeta('property', 'og:title', fullTitle);
		updateMeta('property', 'og:description', description);
		updateMeta('property', 'og:image', ogImage);
		updateMeta('property', 'og:type', type);

		// 4. 博客文章特有标签 (时间戳)
		if (type === 'article') {
			if (publishedTime) {
				updateMeta('property', 'article:published_time', publishedTime);
			}
			if (updatedTime) {
				updateMeta('property', 'article:modified_time', updatedTime);
				// 部分爬虫读取 og:updated_time
				updateMeta('property', 'og:updated_time', updatedTime);
			}
		}

		// 5. 卸载时的清理/还原逻辑
		return () => {
			if (!preserve) {
				document.title = prevValues.current.title;
				updateMeta('name', 'description', prevValues.current.description);
				updateMeta('name', 'keywords', prevValues.current.keywords);

				// 如果是文章页，卸载时移除时间标签，防止污染其他页面
				if (type === 'article') {
					removeMeta('property', 'article:published_time');
					removeMeta('property', 'article:modified_time');
					removeMeta('property', 'og:updated_time');
				}
			}
		};
	}, [
		title,
		description,
		keywords,
		ogImage,
		type,
		publishedTime,
		updatedTime,
		preserve,
		hasSuffix,
	]);
}

/**
 * 仅更新标题的快捷 Hook
 */
export function useTitle(
	title: string,
	options: Pick<SeoOptions, 'hasSuffix' | 'preserve'> = {}
) {
	useSeo({ title, ...options });
}

/**
 * 工具函数：更新或创建 Meta 标签
 */
function updateMeta(attr: 'name' | 'property', key: string, content?: string) {
	if (content === undefined || typeof document === 'undefined') return;
	let el = document.querySelector(`meta[${attr}="${key}"]`);
	if (!el) {
		el = document.createElement('meta');
		el.setAttribute(attr, key);
		document.head.appendChild(el);
	}
	el.setAttribute('content', content || '');
}

/**
 * 工具函数：移除 Meta 标签
 */
function removeMeta(attr: 'name' | 'property', key: string) {
	if (typeof document === 'undefined') return;
	const el = document.querySelector(`meta[${attr}="${key}"]`);
	if (el) el.remove();
}

/**
 * 工具函数：获取当前 Meta 内容
 */
function getMeta(name: string): string {
	if (typeof document === 'undefined') return '';
	const el = document.querySelector(`meta[name="${name}"]`);
	return el ? el.getAttribute('content') || '' : '';
}
