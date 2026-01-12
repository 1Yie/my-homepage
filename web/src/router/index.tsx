import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
	{
		path: '/',
		lazy: () =>
			import('@/layout/home').then((module) => ({
				Component: module.AppLayout,
			})),
		children: [
			{
				path: '*',
				lazy: () =>
					import('@/pages/error/not-found').then((module) => ({
						Component: module.NotFoundPage,
					})),
			},
			{
				index: true,
				lazy: () =>
					import('@/pages/home').then((module) => ({
						Component: module.HomePage,
					})),
			},
			{
				path: 'blog',
				lazy: () =>
					import('@/pages/blog').then((module) => ({
						Component: module.BlogPage,
					})),
			},
			{
				path: 'about',
				lazy: () =>
					import('@/pages/about').then((module) => ({
						Component: module.AboutPage,
					})),
			},
			{
				path: 'links',
				lazy: () =>
					import('@/pages/links').then((module) => ({
						Component: module.LinksPage,
					})),
			},
		],
	},
	{
		path: '/auth',
		lazy: () =>
			import('@/layout/auth').then((module) => ({
				Component: module.AuthLayout,
			})),
		children: [
			{
				path: 'login',
				lazy: () =>
					import('@/pages/auth/login').then((module) => ({
						Component: module.LoginPage,
					})),
			},
		],
	},
]);
