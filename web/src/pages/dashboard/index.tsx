import {
	BarChart3,
	FileText,
	FolderKanban,
	Images,
	PlusCircle,
	TrendingUp,
	Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { authClient, client } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface DashboardData {
	overview: {
		totalArticles: number;
		publishedArticles: number;
		draftArticles: number;
		totalProjects: number;
		totalSlides: number;
		totalTags: number;
		totalUsers: number;
	};
	recentArticles: Array<{
		id: number;
		title: string;
		slug: string;
		isDraft: boolean;
		createdAt: string;
		updatedAt: string;
		author: {
			id: string;
			name: string;
			email: string;
		};
		tags: Array<{
			id: number;
			name: string;
		}>;
	}>;
	recentProjects: Array<{
		id: number;
		name: string;
		description: string;
		tags: string[];
		imageUrl: string | null;
		githubUrl: string | null;
		liveUrl: string | null;
		order: number;
		createdAt: string;
		updatedAt: string;
	}>;
	recentSlides: Array<{
		id: number;
		title: string;
		src: string;
		button: string | null;
		link: string | null;
		newTab: boolean;
		order: number;
		createdAt: string;
		updatedAt: string;
	}>;
	articlesByMonth: Array<{
		month: string;
		count: number;
		publishedCount: number;
		draftCount: number;
	}>;
	topTags: Array<{
		id: number;
		name: string;
		articleCount: number;
	}>;
	articleStatusDistribution: {
		published: number;
		draft: number;
	};
	recentActivityTrend: Array<{
		date: string;
		articlesCreated: number;
		projectsCreated: number;
		slidesCreated: number;
	}>;
}

export function DashboardPage() {
	const { data: session } = authClient.useSession();
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				const response = await client.dashboard.stats.get();
				if (response.data && response.data.success) {
					setDashboardData(response.data.data as unknown as DashboardData);
				}
			} catch (error) {
				console.error('Failed to fetch dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const statCards = [
		{
			title: '总文章数',
			value: dashboardData?.overview.totalArticles ?? 0,
			subtitle: `已发布 ${dashboardData?.overview.publishedArticles ?? 0} 篇`,
			icon: FileText,
			href: '/dashboard/articles',
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			title: '项目展示',
			value: dashboardData?.overview.totalProjects ?? 0,
			subtitle: '在线展示项目',
			icon: FolderKanban,
			href: '/dashboard/projects',
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: '相册图片',
			value: dashboardData?.overview.totalSlides ?? 0,
			subtitle: '轮播图片数量',
			icon: Images,
			href: '/dashboard/slides',
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
		},
		{
			title: '标签总数',
			value: dashboardData?.overview.totalTags ?? 0,
			subtitle: '内容分类标签',
			icon: TrendingUp,
			href: '/dashboard/articles',
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
		},
	];

	const quickActions = [
		{
			label: '创建文章',
			href: '/dashboard/articles/create',
			icon: FileText,
		},
		{
			label: '添加项目',
			href: '/dashboard/projects/create',
			icon: FolderKanban,
		},
		{
			label: '添加图片',
			href: '/dashboard/slides/create',
			icon: Images,
		},
	];

	// 格式化日期
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	};

	// 计算最近 7 天的总活动数
	const recentTotalActivity = dashboardData?.recentActivityTrend.reduce(
		(sum, day) =>
			sum + day.articlesCreated + day.projectsCreated + day.slidesCreated,
		0
	);

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
					{statCards.map((stat, index) => (
						<Link key={index} to={stat.href}>
							<Card
								className="transition-all cursor-pointer border-l-4"
								style={{
									borderLeftColor: stat.color.replace('text-', ''),
								}}
							>
								<CardHeader
									className="flex flex-row items-center justify-between
										space-y-0 pb-2"
								>
									<CardTitle className="text-sm font-medium">
										{stat.title}
									</CardTitle>
									<div className={`p-2 rounded-lg ${stat.bgColor}`}>
										<stat.icon className={`h-4 w-4 ${stat.color}`} />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{loading ? '...' : stat.value}
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										{stat.subtitle}
									</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				{/* Welcome Card - Full Width */}
				<Card>
					<CardHeader>
						<CardTitle>欢迎回来，{session?.user.name || '管理员'}！</CardTitle>
						<CardDescription>
							这是您的后台管理仪表盘。您可以在这里管理文章、项目、相册等内容。
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{/* Quick Actions */}
						<div>
							<h4 className="text-sm font-semibold mb-3">快速操作</h4>
							<div className="flex flex-wrap gap-2">
								{quickActions.map((action, index) => (
									<Button
										key={index}
										render={
											<Link to={action.href}>
												<PlusCircle className="mr-2 h-4 w-4" />
												{action.label}
											</Link>
										}
										size="sm"
										variant={index === 0 ? 'default' : 'outline'}
									/>
								))}
							</div>
						</div>

						{/* System Overview */}
						<div className="mt-2 p-4 bg-muted rounded-lg">
							<h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
								<BarChart3 className="h-4 w-4" />
								系统概览
							</h4>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">已发布</p>
									<p className="font-semibold text-lg">
										{loading
											? '...'
											: (dashboardData?.overview.publishedArticles ?? 0)}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">草稿</p>
									<p className="font-semibold text-lg">
										{loading
											? '...'
											: (dashboardData?.overview.draftArticles ?? 0)}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">用户数</p>
									<p className="font-semibold text-lg flex items-center gap-1">
										{loading
											? '...'
											: (dashboardData?.overview.totalUsers ?? 0)}
										<Users className="h-3 w-3" />
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">7日活动</p>
									<p className="font-semibold text-lg">
										{loading ? '...' : (recentTotalActivity ?? 0)}
									</p>
								</div>
							</div>
						</div>

						{/* Top Tags */}
						{dashboardData && dashboardData.topTags.length > 0 && (
							<div className="mt-2">
								<h4 className="text-sm font-semibold mb-3">热门标签</h4>
								<div className="flex flex-wrap gap-2">
									{dashboardData.topTags.slice(0, 8).map((tag) => (
										<Badge key={tag.id} size="lg" variant="secondary">
											{tag.name} ({tag.articleCount})
										</Badge>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Three Column Layout - Articles, Projects, Slides */}
				<div className="grid gap-4 md:gap-8 lg:grid-cols-3">
					{/* Recent Articles Card */}
					<Card>
						<CardHeader>
							<CardTitle>最近文章</CardTitle>
							<CardDescription>最新创建或编辑的文章</CardDescription>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<p className="text-muted-foreground text-sm">加载中...</p>
								</div>
							) : !dashboardData ||
							  dashboardData.recentArticles.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8">
									<p className="text-muted-foreground text-sm mb-4">暂无文章</p>
									<Button
										render={
											<Link to="/dashboard/articles/create">
												<PlusCircle className="mr-2 h-4 w-4" />
												创建文章
											</Link>
										}
										size="sm"
									/>
								</div>
							) : (
								<div className="space-y-4">
									{dashboardData.recentArticles.slice(0, 5).map((article) => (
										<div className="flex items-start gap-3" key={article.id}>
											<div className="flex-1 space-y-1 min-w-0">
												<Link to={`/dashboard/articles/edit/${article.id}`}>
													<p
														className="text-sm font-medium leading-tight
															hover:underline truncate"
													>
														{article.title}
													</p>
												</Link>
												<div
													className="flex items-center gap-2 text-xs
														text-muted-foreground"
												>
													<span>{formatDate(article.createdAt)}</span>
													{article.tags.length > 0 && (
														<>
															<span>·</span>
															<span className="truncate">
																{article.tags
																	.slice(0, 2)
																	.map((t) => t.name)
																	.join(', ')}
															</span>
														</>
													)}
												</div>
											</div>
											<Badge
												className="shrink-0"
												variant={article.isDraft ? 'secondary' : 'default'}
											>
												{article.isDraft ? '草稿' : '已发布'}
											</Badge>
										</div>
									))}
									{dashboardData.recentArticles.length > 5 && (
										<Button
											className="w-full mt-4"
											render={<Link to="/dashboard/articles">查看全部</Link>}
											size="sm"
											variant="outline"
										/>
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Recent Projects Card */}
					<Card>
						<CardHeader>
							<CardTitle>最近作品</CardTitle>
							<CardDescription>最新添加的项目展示</CardDescription>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<p className="text-muted-foreground text-sm">加载中...</p>
								</div>
							) : !dashboardData ||
							  dashboardData.recentProjects.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8">
									<p className="text-muted-foreground text-sm mb-4">暂无作品</p>
									<Button
										render={
											<Link to="/dashboard/projects/create">
												<PlusCircle className="mr-2 h-4 w-4" />
												添加作品
											</Link>
										}
										size="sm"
									/>
								</div>
							) : (
								<div className="space-y-4">
									{dashboardData.recentProjects.slice(0, 3).map((project) => (
										<div className="flex items-start gap-3" key={project.id}>
											{project.imageUrl && (
												<img
													alt={project.name}
													className="w-16 h-16 rounded object-cover shrink-0"
													src={project.imageUrl}
												/>
											)}
											<div className="flex-1 min-w-0">
												<Link to={`/dashboard/projects/edit/${project.id}`}>
													<p
														className="text-sm font-medium leading-tight
															hover:underline"
													>
														{project.name}
													</p>
												</Link>
												<p
													className="text-xs text-muted-foreground mt-1
														line-clamp-2"
												>
													{project.description}
												</p>
												<div className="flex flex-wrap gap-1 mt-2">
													{project.tags.slice(0, 3).map((tag, idx) => (
														<Badge
															className="text-xs"
															key={idx}
															variant="outline"
														>
															{tag}
														</Badge>
													))}
												</div>
											</div>
										</div>
									))}
									<Button
										className="w-full"
										render={<Link to="/dashboard/projects">查看全部</Link>}
										size="sm"
										variant="outline"
									/>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Recent Slides Card */}
					<Card>
						<CardHeader>
							<CardTitle>最近图片</CardTitle>
							<CardDescription>最新添加的相册图片</CardDescription>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<p className="text-muted-foreground text-sm">加载中...</p>
								</div>
							) : !dashboardData || dashboardData.recentSlides.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8">
									<p className="text-muted-foreground text-sm mb-4">暂无图片</p>
									<Button
										render={
											<Link to="/dashboard/slides/create">
												<PlusCircle className="mr-2 h-4 w-4" />
												添加图片
											</Link>
										}
										size="sm"
									/>
								</div>
							) : (
								<div className="space-y-4">
									{dashboardData.recentSlides.slice(0, 3).map((slide) => (
										<div className="flex items-center gap-3" key={slide.id}>
											<img
												alt={slide.title}
												className="w-20 h-14 rounded object-cover shrink-0"
												src={slide.src}
											/>
											<div className="flex-1 min-w-0">
												<Link to={`/dashboard/slides/edit/${slide.id}`}>
													<p
														className="text-sm font-medium leading-tight
															hover:underline truncate"
													>
														{slide.title}
													</p>
												</Link>
												<p className="text-xs text-muted-foreground mt-1">
													{formatDate(slide.createdAt)}
												</p>
											</div>
										</div>
									))}
									<Button
										className="w-full"
										render={<Link to="/dashboard/slides">查看全部</Link>}
										size="sm"
										variant="outline"
									/>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
