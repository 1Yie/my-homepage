import { createBrowserRouter, type RouteObject } from 'react-router-dom';

export type RouteConfig = RouteObject & {
	label?: string;
	children?: RouteConfig[];
};

export const routeConfig: RouteConfig[] = [
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
		label: '后台管理',
		lazy: () =>
			import('@/layout/dashboard').then((module) => ({
				Component: module.DashboardLayout,
			})),
		children: [
			{
				index: true,
				label: '仪表盘',
				lazy: () =>
					import('@/pages/dashboard').then((module) => ({
						Component: module.DashboardPage,
					})),
			},
			{
				path: 'articles',
				label: '文章管理',
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
						label: '创建文章',
						lazy: () =>
							import('@/pages/dashboard/articles/create').then((module) => ({
								Component: module.CreateArticlePage,
							})),
					},
					{
						path: 'edit/:id',
						label: '编辑文章',
						lazy: () =>
							import('@/pages/dashboard/articles/edit').then((module) => ({
								Component: module.EditArticlePage,
							})),
					},
				],
			},
			{
				path: 'projects',
				label: '项目管理',
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
						label: '创建项目',
						lazy: () =>
							import('@/pages/dashboard/projects/create').then((module) => ({
								Component: module.CreateProjectPage,
							})),
					},
					{
						path: 'edit/:id',
						label: '编辑项目',
						lazy: () =>
							import('@/pages/dashboard/projects/edit').then((module) => ({
								Component: module.EditProjectPage,
							})),
					},
				],
			},
			{
				path: 'slides',
				label: '相册管理',
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
						label: '添加图片',
						lazy: () =>
							import('@/pages/dashboard/slides/create').then((module) => ({
								Component: module.CreateSlidePage,
							})),
					},
					{
						path: 'edit/:id',
						label: '编辑图片',
						lazy: () =>
							import('@/pages/dashboard/slides/edit').then((module) => ({
								Component: module.EditSlidePage,
							})),
					},
				],
			},
			{
				path: 'tags',
				label: '标签管理',
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
						label: '创建标签',
						lazy: () =>
							import('@/pages/dashboard/tags/create').then((module) => ({
								Component: module.CreateTagPage,
							})),
					},
					{
						path: 'edit/:id',
						label: '编辑标签',
						lazy: () =>
							import('@/pages/dashboard/tags/edit').then((module) => ({
								Component: module.EditTagPage,
							})),
					},
				],
			},
			{
				path: 'friends',
				label: '友链管理',
				children: [
					{
						index: true,
						lazy: () =>
							import('@/pages/dashboard/friends').then((module) => ({
								Component: module.FriendsPage,
							})),
					},
					{
						path: 'create',
						label: '添加友链',
						lazy: () =>
							import('@/pages/dashboard/friends/create').then((module) => ({
								Component: module.CreateFriendPage,
							})),
					},
					{
						path: 'edit/:id',
						label: '编辑友链',
						lazy: () =>
							import('@/pages/dashboard/friends/edit').then((module) => ({
								Component: module.EditFriendPage,
							})),
					},
				],
			},
		],
	},
];

export const router = createBrowserRouter(routeConfig);
