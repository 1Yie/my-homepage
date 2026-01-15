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
	/** 组件卸载时是否保留当前设置（默认 false） */
	preserve?: boolean;
	/** 是否保留 "| ichiyo" 后缀（默认 true） */
	hasSuffix?: boolean;
}

/**
 * 核心 SEO Hook
 * 支持标题、介绍、关键词及社交媒体标签的完整设置
 */
export function useSeo(options: SeoOptions) {
	const {
		title,
		description,
		keywords,
		ogImage,
		preserve = false,
		hasSuffix = true,
	} = options;

	// 记录初始值，用于组件卸载时还原
	const prevValues = useRef({
		title: document.title,
		description: getMeta('description'),
		keywords: getMeta('keywords'),
	});

	useEffect(() => {
		const baseTitle = 'ichiyo';
		let fullTitle = '';

		if (title !== undefined) {
			fullTitle =
				hasSuffix && title ? `${title} | ${baseTitle}` : title || baseTitle;
			if (document.title !== fullTitle) {
				document.title = fullTitle;
			}
		}

		updateMeta('name', 'description', description);
		updateMeta(
			'name',
			'keywords',
			Array.isArray(keywords) ? keywords.join(', ') : keywords
		);

		if (fullTitle) updateMeta('property', 'og:title', fullTitle);
		updateMeta('property', 'og:description', description);
		updateMeta('property', 'og:image', ogImage);

		return () => {
			if (!preserve) {
				document.title = prevValues.current.title;
				updateMeta('name', 'description', prevValues.current.description);
				// eslint-disable-next-line react-hooks/exhaustive-deps
				updateMeta('name', 'keywords', prevValues.current.keywords);
			}
		};
	}, [title, description, keywords, ogImage, preserve, hasSuffix]);
}

/**
 * useTitle
 *
 */
export function useTitle(
	title: string,
	options: Omit<SeoOptions, 'title'> = {}
) {
	useSeo({ title, ...options });
}

function updateMeta(attr: 'name' | 'property', key: string, content?: string) {
	if (content === undefined) return;
	let el = document.querySelector(`meta[${attr}="${key}"]`);
	if (!el) {
		el = document.createElement('meta');
		el.setAttribute(attr, key);
		document.head.appendChild(el);
	}
	el.setAttribute('content', content || '');
}

function getMeta(name: string): string {
	if (typeof document === 'undefined') return '';
	const el = document.querySelector(`meta[name="${name}"]`);
	return el ? el.getAttribute('content') || '' : '';
}
