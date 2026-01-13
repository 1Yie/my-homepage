import { useEffect, useRef } from 'react';

/**
 * @param title 页面标题
 * @param options 配置项
 * - preserve: 组件卸载时是否保留当前标题（默认 false）
 * - hasSuffix: 是否保留 "| ichiyo" 后缀（默认 true）
 */
export function useTitle(
	title: string,
	options: { preserve?: boolean; hasSuffix?: boolean } = {}
) {
	const { preserve = false, hasSuffix = true } = options;
	const prevTitle = useRef(document.title);

	useEffect(() => {
		const baseTitle = 'ichiyo';
		let fullTitle = '';

		if (hasSuffix) {
			// 如果需要后缀：有 title 就拼接，没有则只显示 baseTitle
			fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
		} else {
			// 如果不需要后缀：直接显示传入的 title
			fullTitle = title;
		}

		if (document.title !== fullTitle) {
			document.title = fullTitle;
		}

		return () => {
			if (!preserve) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				document.title = prevTitle.current;
			}
		};
	}, [title, preserve, hasSuffix]);
}
