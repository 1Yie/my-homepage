import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { routeConfig, type RouteConfig } from '@/router';

export interface BreadcrumbItem {
	label: string;
	href: string;
}

// Non-exact prefix match
function matchRoute(path: string, pathname: string) {
	return matchPath({ path, end: false }, pathname);
}

// Exact match for leaf nodes
function matchExactRoute(path: string, pathname: string) {
	return matchPath({ path, end: true }, pathname);
}

// Recursively find matching breadcrumb items
function findBreadcrumbs(
	routes: RouteConfig[],
	pathname: string,
	parentPath = ''
): BreadcrumbItem[] {
	for (const route of routes) {
		if (!route.path || !route.label || route.path === '/') continue;

		const fullPath = parentPath
			? `${parentPath}/${route.path.replace(/^\//, '')}`
			: route.path;

		const match = matchRoute(fullPath, pathname);
		if (!match) continue;

		const current: BreadcrumbItem = { label: route.label!, href: fullPath };

		// Recursively check child routes first
		if (route.children) {
			const children = findBreadcrumbs(route.children, pathname, fullPath);
			if (children.length) {
				return [current, ...children];
			}
		}

		// Exact match for leaf nodes
		const exactMatch = matchExactRoute(fullPath, pathname);
		if (exactMatch) {
			// For leaf nodes, use the actual pathname as href
			return [{ label: route.label!, href: pathname }];
		}
	}

	// No matching route found
	return [];
}

export function useBreadcrumbItems() {
	const { pathname } = useLocation();

	return useMemo(() => {
		const items: BreadcrumbItem[] = [];

		// Handle root separately
		const root = routeConfig.find((r) => r.path === '/' && r.label);
		if (root) items.push({ label: root.label!, href: '/' });

		if (pathname === '/') return items;

		const rest = findBreadcrumbs(routeConfig, pathname);

		// Fallback for 404, only show root
		if (rest.length === 0) return items;

		return [...items, ...rest];
	}, [pathname]);
}
