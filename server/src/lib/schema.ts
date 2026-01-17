import { t, type Static } from 'elysia';

export type ArticleResponse = Static<typeof articleResponseSchema>;
export type TagResponse = Static<typeof tagResponseSchema> & {
	articles: { updatedAt: string }[];
};

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export const createArticleSchema = t.Object({
	title: t.String({ description: '文章标题' }),
	slug: t.String({ description: '文章的URL slug，用于生成友好的链接' }),
	content: t.String({ description: '文章的完整内容，支持Markdown格式' }),
	headerImage: t.Optional(t.String({ description: '文章头图的URL地址' })),
	isDraft: t.Optional(
		t.Boolean({ description: '是否为草稿状态，默认为false' })
	),
	tagIds: t.Optional(t.Array(t.Number({ description: '关联的标签ID数组' }))),
});

export const updateArticleSchema = t.Object({
	title: t.Optional(t.String({ description: '文章标题' })),
	slug: t.Optional(
		t.String({ description: '文章的URL slug，用于生成友好的链接' })
	),
	content: t.Optional(
		t.String({ description: '文章的完整内容，支持Markdown格式' })
	),
	headerImage: t.Optional(t.String({ description: '文章头图的URL地址' })),
	isDraft: t.Optional(
		t.Boolean({ description: '是否为草稿状态，默认为false' })
	),
	tagIds: t.Optional(t.Array(t.Number({ description: '关联的标签ID数组' }))),
});

export const articleResponseSchema = t.Object({
	id: t.Number(),
	title: t.String(),
	slug: t.String(),
	content: t.String(),
	headerImage: t.Optional(t.String()),
	isDraft: t.Boolean(),
	createdAt: t.String(),
	updatedAt: t.String(),
	authorId: t.String(),
	tags: t.Array(
		t.Object({
			id: t.Number(),
			name: t.String(),
		})
	),
});

export const tagSchema = t.Object({
	name: t.String({ description: '标签名称' }),
});

export const tagResponseSchema = t.Object({
	id: t.Number(),
	name: t.String(),
});

// Project schemas
export const createProjectSchema = t.Object({
	name: t.String({ description: '项目名称' }),
	description: t.String({ description: '项目描述' }),
	tags: t.Array(t.String({ description: '项目标签' })),
	imageUrl: t.Optional(t.String({ description: '项目图片的URL地址' })),
	githubUrl: t.Optional(t.String({ description: 'GitHub仓库地址' })),
	liveUrl: t.Optional(t.String({ description: '项目演示地址' })),
	order: t.Optional(t.Number({ description: '显示顺序，数字越小越靠前' })),
});

export const updateProjectSchema = t.Object({
	name: t.Optional(t.String({ description: '项目名称' })),
	description: t.Optional(t.String({ description: '项目描述' })),
	tags: t.Optional(t.Array(t.String({ description: '项目标签' }))),
	imageUrl: t.Optional(t.String({ description: '项目图片的URL地址' })),
	githubUrl: t.Optional(t.String({ description: 'GitHub仓库地址' })),
	liveUrl: t.Optional(t.String({ description: '项目演示地址' })),
	order: t.Optional(t.Number({ description: '显示顺序，数字越小越靠前' })),
});

// Slide schemas
export const createSlideSchema = t.Object({
	title: t.String({ description: '轮播图片标题' }),
	src: t.String({ description: '轮播图片的URL地址' }),
	button: t.Optional(t.String({ description: '按钮文本' })),
	link: t.Optional(t.String({ description: '按钮链接地址' })),
	newTab: t.Optional(t.Boolean({ description: '是否在新标签页打开链接' })),
	order: t.Optional(t.Number({ description: '显示顺序，数字越小越靠前' })),
});

export const updateSlideSchema = t.Object({
	title: t.Optional(t.String({ description: '轮播图片标题' })),
	src: t.Optional(t.String({ description: '轮播图片的URL地址' })),
	button: t.Optional(t.String({ description: '按钮文本' })),
	link: t.Optional(t.String({ description: '按钮链接地址' })),
	newTab: t.Optional(t.Boolean({ description: '是否在新标签页打开链接' })),
	order: t.Optional(t.Number({ description: '显示顺序，数字越小越靠前' })),
});

// Friend schemas
export const socialLinkSchema = t.Object({
	name: t.String({ description: '社交平台的名称' }),
	link: t.String({ description: '社交平台的链接地址' }),
	iconLight: t.String({ description: '浅色主题下的图标URL' }),
	iconDark: t.String({ description: '深色主题下的图标URL' }),
});

export const createFriendSchema = t.Object({
	name: t.String({ description: '友链名称' }),
	image: t.String({ description: '友链头像或图片URL' }),
	description: t.String({ description: '友链描述' }),
	pinned: t.Optional(t.Boolean({ description: '是否置顶显示' })),
	order: t.Optional(t.Number({ description: '显示顺序，数字越小越靠前' })),
	socialLinks: t.Array(socialLinkSchema, { description: '社交媒体链接数组' }),
});

export const updateFriendSchema = t.Object({
	name: t.Optional(t.String({ description: '友链名称' })),
	image: t.Optional(t.String({ description: '友链头像或图片URL' })),
	description: t.Optional(t.String({ description: '友链描述' })),
	pinned: t.Optional(t.Boolean({ description: '是否置顶显示' })),
	order: t.Optional(t.Number({ description: '显示顺序，数字越小越靠前' })),
	socialLinks: t.Optional(
		t.Array(socialLinkSchema, { description: '社交媒体链接数组' })
	),
});
