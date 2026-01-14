import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('theme') as Theme;
			return stored || 'system';
		}
		return 'system';
	});

	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	const updateTheme = useCallback(() => {
		const effectiveTheme =
			theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
		const dark = effectiveTheme === 'dark';
		document.documentElement.classList.toggle('dark', dark);

		// Update favicon based on theme
		const favicon = document.querySelector(
			'link[rel="icon"]'
		) as HTMLLinkElement;
		if (favicon) {
			favicon.href = dark ? '/logo_dark.svg' : '/logo_light.svg';
		}
	}, [mediaQuery.matches, theme]);

	useEffect(() => {
		updateTheme();

		if (theme === 'system') {
			mediaQuery.addEventListener('change', updateTheme);
			return () => mediaQuery.removeEventListener('change', updateTheme);
		}
	}, [mediaQuery, theme, updateTheme]);

	const effectiveTheme =
		theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
	const currentIsDark = effectiveTheme === 'dark';

	const setThemeValue = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	const toggleTheme = () => {
		const nextTheme: Theme =
			theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
		setThemeValue(nextTheme);
	};

	return { theme, isDark: currentIsDark, setTheme: setThemeValue, toggleTheme };
}
