import { db } from './src/lib/db';

async function seed() {
	console.log('开始添加初始数据...');

	// 添加项目数据
	const projects = [
		{
			name: 'ichiyo.in',
			description: '个人博客网站，使用 React + Elysia 构建',
			tags: JSON.stringify([
				'React',
				'TypeScript',
				'Tailwind CSS',
				'Elysia',
				'Bun',
			]),
			githubUrl: 'https://github.com',
			liveUrl: 'https://ichiyo.in',
			imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
			order: 1,
		},
		{
			name: '示例项目 1',
			description: '这是一个示例项目描述，展示项目的主要功能和技术栈',
			tags: JSON.stringify(['Next.js', 'TypeScript', 'Prisma']),
			githubUrl: 'https://github.com',
			imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
			order: 2,
		},
		{
			name: '示例项目 2',
			description: '另一个示例项目，使用现代化的技术栈构建',
			tags: JSON.stringify(['Vue', 'Vite', 'TailwindCSS']),
			liveUrl: 'https://example.com',
			imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
			order: 3,
		},
	];

	for (const project of projects) {
		await db.project.create({ data: project });
		console.log(`✓ 创建项目: ${project.name}`);
	}

	// 添加图片数据
	const slides = [
		{
			title: '美丽的风景',
			src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
			button: '查看更多',
			link: '#',
			newTab: false,
			order: 1,
		},
		{
			title: '城市夜景',
			src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
			button: '探索',
			link: '#',
			newTab: false,
			order: 2,
		},
		{
			title: '自然之美',
			src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
			button: '了解更多',
			link: '#',
			newTab: false,
			order: 3,
		},
		{
			title: '山川湖海',
			src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
			button: '探索',
			link: '#',
			newTab: false,
			order: 4,
		},
	];

	for (const slide of slides) {
		await db.slide.create({ data: slide });
		console.log(`✓ 创建图片: ${slide.title}`);
	}

	// 添加友链数据
	const friends = [
		{
			name: 'Alice',
			image: 'https://i.pravatar.cc/150?img=1',
			description: 'Full-stack developer and open source enthusiast',
			pinned: true,
			order: 1,
			socialLinks: {
				create: [
					{
						name: 'GitHub',
						link: 'https://github.com/alice',
						iconLight: 'https://cdn.simpleicons.org/github/000000',
						iconDark: 'https://cdn.simpleicons.org/github/FFFFFF',
					},
					{
						name: 'Twitter',
						link: 'https://twitter.com/alice',
						iconLight: 'https://cdn.simpleicons.org/twitter/1DA1F2',
						iconDark: 'https://cdn.simpleicons.org/twitter/1DA1F2',
					},
				],
			},
		},
		{
			name: 'Bob',
			image: 'https://i.pravatar.cc/150?img=2',
			description: 'Designer and creative coder',
			pinned: true,
			order: 2,
			socialLinks: {
				create: [
					{
						name: 'Dribbble',
						link: 'https://dribbble.com/bob',
						iconLight: 'https://cdn.simpleicons.org/dribbble/EA4C89',
						iconDark: 'https://cdn.simpleicons.org/dribbble/EA4C89',
					},
					{
						name: 'GitHub',
						link: 'https://github.com/bob',
						iconLight: 'https://cdn.simpleicons.org/github/000000',
						iconDark: 'https://cdn.simpleicons.org/github/FFFFFF',
					},
				],
			},
		},
		{
			name: 'Charlie',
			image: 'https://i.pravatar.cc/150?img=3',
			description: 'Tech blogger',
			pinned: false,
			order: 3,
			socialLinks: {
				create: [
					{
						name: 'Website',
						link: 'https://charlie.dev',
						iconLight: 'https://cdn.simpleicons.org/googlechrome/4285F4',
						iconDark: 'https://cdn.simpleicons.org/googlechrome/4285F4',
					},
					{
						name: 'Twitter',
						link: 'https://twitter.com/charlie',
						iconLight: 'https://cdn.simpleicons.org/twitter/1DA1F2',
						iconDark: 'https://cdn.simpleicons.org/twitter/1DA1F2',
					},
				],
			},
		},
		{
			name: 'David',
			image: 'https://i.pravatar.cc/150?img=4',
			description: 'Data scientist',
			pinned: false,
			order: 4,
			socialLinks: {
				create: [
					{
						name: 'LinkedIn',
						link: 'https://linkedin.com/in/david',
						iconLight: 'https://cdn.simpleicons.org/linkedin/0A66C2',
						iconDark: 'https://cdn.simpleicons.org/linkedin/0A66C2',
					},
					{
						name: 'GitHub',
						link: 'https://github.com/david',
						iconLight: 'https://cdn.simpleicons.org/github/000000',
						iconDark: 'https://cdn.simpleicons.org/github/FFFFFF',
					},
				],
			},
		},
	];

	for (const friend of friends) {
		await db.friend.create({ data: friend });
		console.log(`✓ 创建友链: ${friend.name}`);
	}

	console.log('初始数据添加完成！');
}

seed()
	.catch((e) => {
		console.error('添加数据时出错:', e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
