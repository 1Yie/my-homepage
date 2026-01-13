import Artalk from 'artalk';
import { useEffect, useRef } from 'react';

import { useTheme } from '@/hooks/use-theme';

export function Comments() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { isDark } = useTheme();

	useEffect(() => {
		if (!containerRef.current) return;

		let currentIsDark = isDark;

		const artalk = new Artalk({
			el: containerRef.current,
			pageKey: window.location.pathname,
			pageTitle: document.title,
			server: 'https://artalk.ichiyo.in/',
			site: 'ichiyo.in Artalk',
			darkMode: currentIsDark,
			flatMode: 'auto',
		});

		const updateArtalkTheme = () => {
			const newIsDark = document.documentElement.classList.contains('dark');
			if (newIsDark !== currentIsDark) {
				currentIsDark = newIsDark;
				artalk.setDarkMode(currentIsDark);
			}
		};

		// 监听 html class 改变
		const observer = new MutationObserver(updateArtalkTheme);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => {
			observer.disconnect();
			artalk.destroy();
		};
	}, [isDark]);

	return <div ref={containerRef}></div>;
}
