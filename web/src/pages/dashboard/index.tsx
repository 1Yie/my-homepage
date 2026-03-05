import {
	BarChart3,
	FileText,
	FolderKanban,
	Images,
	Link as LinkIcon,
	PlusCircle,
	TrendingUp,
	Users,
	Rocket,
	PencilLine,
	RadioTower,
	Newspaper,
	Briefcase,
	Aperture,
	Handshake,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { authClient } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useTitle } from '@/hooks/use-page-meta';

export function DashboardPage() {
	const { data: session } = authClient.useSession();
	const { dashboardData, loading } = useDashboardStats();

	useTitle('仪表盘');

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
			href: '/dashboard/tags',
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
		},
		{
			title: '友情链接',
			value: dashboardData?.overview.totalFriends ?? 0,
			subtitle: '友链伙伴数量',
			icon: LinkIcon,
			href: '/dashboard/friends',
			color: 'text-pink-600',
			bgColor: 'bg-pink-50',
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
		{
			label: '添加标签',
			href: '/dashboard/tags/create',
			icon: LinkIcon,
		},
		{
			label: '添加友链',
			href: '/dashboard/friends/create',
			icon: LinkIcon,
		},
	];

	// 格式化日期
	const formatDate = (dateString: Date) => {
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
				<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
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

				{/* Welcome Card */}
				<Card>
					<CardHeader>
						<CardTitle className="text-3xl">
							👋 欢迎回来，{session?.user.name || 'unknown'}！
						</CardTitle>
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
							<div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">已发布</p>
									<p className="font-semibold text-lg flex items-center gap-1">
										{loading
											? '...'
											: (dashboardData?.overview.publishedArticles ?? 0)}
										<Rocket className="h-3 w-3" />
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">草稿</p>
									<p className="font-semibold text-lg flex items-center gap-1">
										{loading
											? '...'
											: (dashboardData?.overview.draftArticles ?? 0)}
										<PencilLine className="h-3 w-3" />
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">总阅读量</p>
									<p className="font-semibold text-lg flex items-center gap-1">
										{loading
											? '...'
											: (dashboardData?.overview.totalArticleViews ?? 0)}
										<TrendingUp className="h-3 w-3" />
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
									<p className="font-semibold text-lg flex items-center gap-1">
										{loading ? '...' : (recentTotalActivity ?? 0)}
										<RadioTower className="h-3 w-3" />
									</p>
								</div>
							</div>
						</div>

						{/* Top Tags */}
						{/* {dashboardData && dashboardData.topTags.length > 0 && (
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
						)} */}
					</CardContent>
				</Card>

				{/* Four Column Layout */}
				<div className="grid gap-4 lg:grid-cols-2">
					{/* Recent Articles Card */}
					<Card className="flex flex-col h-full">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-1 text-lg">
								<Newspaper className="h-5 w-5" />
								最近文章
							</CardTitle>
							<CardDescription className="text-xs">
								最新创建或编辑的文章
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 pt-0">
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<Spinner className="mx-auto" size={32} />
								</div>
							) : !dashboardData ||
							  dashboardData.recentArticles.length === 0 ? (
								<div
									className="flex flex-col items-center justify-center py-8
										flex-1"
								>
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
								<>
									<div className="flex-1 divide-y divide-border">
										{dashboardData.recentArticles.slice(0, 5).map((article) => (
											<div
												className="flex items-center gap-3 py-2.5"
												key={article.id}
											>
												<div className="flex-1 min-w-0">
													<Link to={`/dashboard/articles/edit/${article.id}`}>
														<p
															className="text-sm font-medium truncate
																hover:underline underline-offset-2"
														>
															{article.title}
														</p>
													</Link>
													<p className="text-xs text-muted-foreground mt-0.5">
														{formatDate(article.createdAt)}
														{article.tags.length > 0 && (
															<span
																className="before:content-['·'] before:mx-1.5"
															>
																{article.tags
																	.slice(0, 2)
																	.map((t) => t.name)
																	.join(', ')}
															</span>
														)}
													</p>
												</div>
												<Badge
													className="shrink-0 text-xs"
													variant={article.isDraft ? 'secondary' : 'default'}
												>
													{article.isDraft ? '草稿' : '已发布'}
												</Badge>
											</div>
										))}
									</div>
									<Button
										className="w-full mt-3"
										render={<Link to="/dashboard/articles">查看全部</Link>}
										size="sm"
										variant="outline"
									/>
								</>
							)}
						</CardContent>
					</Card>

					{/* Recent Projects Card */}
					<Card className="flex flex-col h-full">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-1 text-lg">
								<Briefcase className="h-5 w-5" />
								最近作品
							</CardTitle>
							<CardDescription className="text-xs">
								最新添加的项目展示
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 pt-0">
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<Spinner className="mx-auto" size={32} />
								</div>
							) : !dashboardData ||
							  dashboardData.recentProjects.length === 0 ? (
								<div
									className="flex flex-col items-center justify-center py-8
										flex-1"
								>
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
								<>
									<div className="flex-1 divide-y divide-border">
										{dashboardData.recentProjects.slice(0, 3).map((project) => (
											<div className="flex gap-3 py-2.5" key={project.id}>
												{project.imageUrl && (
													<img
														alt={project.name}
														className="w-14 h-14 rounded-md object-cover
															shrink-0"
														src={project.imageUrl}
													/>
												)}
												<div className="flex-1 min-w-0">
													<Link to={`/dashboard/projects/edit/${project.id}`}>
														<p
															className="text-sm font-medium leading-snug
																hover:underline underline-offset-2"
														>
															{project.name}
														</p>
													</Link>
													<p
														className="text-xs text-muted-foreground mt-0.5
															line-clamp-1"
													>
														{project.description}
													</p>
													<div className="flex flex-wrap gap-1 mt-1.5">
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
									</div>
									<Button
										className="w-full mt-3"
										render={<Link to="/dashboard/projects">查看全部</Link>}
										size="sm"
										variant="outline"
									/>
								</>
							)}
						</CardContent>
					</Card>

					{/* Recent Slides Card */}
					<Card className="flex flex-col h-full">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-1 text-lg">
								<Aperture className="h-5 w-5" />
								最近图片
							</CardTitle>
							<CardDescription className="text-xs">
								最新添加的相册图片
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 pt-0">
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<Spinner className="mx-auto" size={32} />
								</div>
							) : !dashboardData || dashboardData.recentSlides.length === 0 ? (
								<div
									className="flex flex-col items-center justify-center py-8
										flex-1"
								>
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
								<>
									<div className="flex-1 divide-y divide-border">
										{dashboardData.recentSlides.slice(0, 3).map((slide) => (
											<div
												className="flex items-center gap-3 py-2.5"
												key={slide.id}
											>
												<img
													alt={slide.title}
													className="w-20 h-12 rounded-md object-cover shrink-0"
													src={slide.src}
												/>
												<div className="flex-1 min-w-0">
													<Link to={`/dashboard/slides/edit/${slide.id}`}>
														<p
															className="text-sm font-medium truncate
																hover:underline underline-offset-2"
														>
															{slide.title}
														</p>
													</Link>
													<p className="text-xs text-muted-foreground mt-0.5">
														{formatDate(slide.createdAt)}
													</p>
												</div>
											</div>
										))}
									</div>
									<Button
										className="w-full mt-3"
										render={<Link to="/dashboard/slides">查看全部</Link>}
										size="sm"
										variant="outline"
									/>
								</>
							)}
						</CardContent>
					</Card>

					{/* Recent Friends Card */}
					<Card className="flex flex-col h-full">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-1 text-lg">
								<Handshake className="h-5 w-5" />
								最近友链
							</CardTitle>
							<CardDescription className="text-xs">
								最新添加的友情链接
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col flex-1 pt-0">
							{loading ? (
								<div className="flex items-center justify-center py-8">
									<Spinner className="mx-auto" size={32} />
								</div>
							) : !dashboardData || dashboardData.recentFriends.length === 0 ? (
								<div
									className="flex flex-col items-center justify-center py-8
										flex-1"
								>
									<p className="text-muted-foreground text-sm mb-4">暂无友链</p>
									<Button
										render={
											<Link to="/dashboard/friends/create">
												<PlusCircle className="mr-2 h-4 w-4" />
												添加友链
											</Link>
										}
										size="sm"
									/>
								</div>
							) : (
								<>
									<div className="flex-1 divide-y divide-border">
										{dashboardData.recentFriends.slice(0, 3).map((friend) => (
											<div
												className="flex items-center gap-3 py-2.5"
												key={friend.id}
											>
												<img
													alt={friend.name}
													className="w-9 h-9 rounded-full object-cover shrink-0"
													src={friend.image}
												/>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-1.5">
														<Link to={`/dashboard/friends/edit/${friend.id}`}>
															<p
																className="text-sm font-medium truncate
																	hover:underline underline-offset-2"
															>
																{friend.name}
															</p>
														</Link>
														{friend.pinned && (
															<Badge
																className="shrink-0 text-xs"
																variant="secondary"
															>
																置顶
															</Badge>
														)}
													</div>
													<p
														className="text-xs text-muted-foreground mt-0.5
															truncate"
													>
														{friend.description}
													</p>
												</div>
											</div>
										))}
									</div>
									<Button
										className="w-full mt-3"
										render={<Link to="/dashboard/friends">查看全部</Link>}
										size="sm"
										variant="outline"
									/>
								</>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
