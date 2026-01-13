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
				children: [
					{
						index: true,
						lazy: () =>
							import('@/pages/blog').then((module) => ({
								Component: module.BlogPage,
							})),
					},
					{
						path: ':slug',
						lazy: () =>
							import('@/pages/blog/detail').then((module) => ({
								Component: module.BlogDetailPage,
							})),
					},
				],
			},
			{
				path: 'about',
				lazy: () =>
					import('@/pages/about').then((module) => ({
						Component: module.AboutPage,
					})),
			},
			{
				path: 'archive',
				lazy: () =>
					import('@/pages/archive').then((module) => ({
						Component: module.ArchivePage,
					})),
			},
			{
				path: 'links',
				lazy: () =>
					import('@/pages/links').then((module) => ({
						Component: module.LinksPage,
					})),
			},
			{
				path: 'tags',
				children: [
					{
						index: true,
						lazy: () =>
							import('@/pages/tags').then((module) => ({
								Component: module.TagsPage,
							})),
					},
					{
						path: ':tagName',
						lazy: () =>
							import('@/pages/tags/tag-name').then((module) => ({
								Component: module.TagArticlesPage,
							})),
					},
				],
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
	{
		path: '/dashboard',
		lazy: () =>
			import('@/layout/dashboard').then((module) => ({
				Component: module.DashboardLayout,
			})),
		children: [
			{
				index: true,
				lazy: () =>
					import('@/pages/dashboard').then((module) => ({
						Component: module.DashboardPage,
					})),
			},
			{
				path: 'articles',
				children: [
					{
						index: true,
						lazy: () =>
							import('@/pages/dashboard/articles').then((module) => ({
								Component: module.ArticlesPage,
							})),
					},
					{
						path: 'create',
						lazy: () =>
							import('@/pages/dashboard/articles/create').then((module) => ({
								Component: module.CreateArticlePage,
							})),
					},
					{
						path: 'edit/:id',
						lazy: () =>
							import('@/pages/dashboard/articles/edit').then((module) => ({
								Component: module.EditArticlePage,
							})),
					},
				],
			},
			{
				path: 'projects',
				children: [
					{
						index: true,
						lazy: () =>
							import('@/pages/dashboard/projects').then((module) => ({
								Component: module.ProjectsPage,
							})),
					},
					{
						path: 'create',
						lazy: () =>
							import('@/pages/dashboard/projects/create').then((module) => ({
								Component: module.CreateProjectPage,
							})),
					},
					{
						path: 'edit/:id',
						lazy: () =>
							import('@/pages/dashboard/projects/edit').then((module) => ({
								Component: module.EditProjectPage,
							})),
					},
				],
			},
			{
				path: 'slides',
				children: [
					{
						index: true,
						lazy: () =>
							import('@/pages/dashboard/slides').then((module) => ({
								Component: module.SlidesPage,
							})),
					},
					{
						path: 'create',
						lazy: () =>
							import('@/pages/dashboard/slides/create').then((module) => ({
								Component: module.CreateSlidePage,
							})),
					},
					{
						path: 'edit/:id',
						lazy: () =>
							import('@/pages/dashboard/slides/edit').then((module) => ({
								Component: module.EditSlidePage,
							})),
					},
				],
			},
			{
				path: 'tags',
				children: [
					{
						index: true,
						lazy: () =>
							import('@/pages/dashboard/tags').then((module) => ({
								Component: module.TagsPage,
							})),
					},
					{
						path: 'create',
						lazy: () =>
							import('@/pages/dashboard/tags/create').then((module) => ({
								Component: module.CreateTagPage,
							})),
					},
					{
						path: 'edit/:id',
						lazy: () =>
							import('@/pages/dashboard/tags/edit').then((module) => ({
								Component: module.EditTagPage,
							})),
					},
				],
			},
		],
	},
]);
