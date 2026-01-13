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

export function DashboardPage() {
	const { data: session } = authClient.useSession();

	const stats = [
		{
			title: '总文章数',
			value: '42',
			description: '+20.1% from last month',
		},
		{
			title: '总访问量',
			value: '2,350',
			description: '+180.1% from last month',
		},
		{
			title: '活跃用户',
			value: '12',
			description: '+19% from last month',
		},
		{
			title: '今日访问',
			value: '573',
			description: '+201 since last hour',
		},
	];

	const recentArticles = [
		{
			id: 1,
			title: '如何使用 React 构建现代 Web 应用',
			status: 'published',
			createdAt: '2024-01-15',
		},
		{
			id: 2,
			title: 'TypeScript 最佳实践指南',
			status: 'draft',
			createdAt: '2024-01-14',
		},
		{
			id: 3,
			title: 'Next.js 14 新特性详解',
			status: 'published',
			createdAt: '2024-01-13',
		},
	];

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
					{stats.map((stat, index) => (
						<Card key={index}>
							<CardHeader
								className="flex flex-row items-center justify-between space-y-0
									pb-2"
							>
								<CardTitle className="text-sm font-medium">
									{stat.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-xs text-muted-foreground">
									{stat.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
					<Card className="xl:col-span-2">
						<CardHeader>
							<CardTitle>
								欢迎回来，{session?.user.name || '管理员'}！
							</CardTitle>
							<CardDescription>
								这是您的后台管理仪表盘。您可以在这里管理文章、用户和查看统计信息。
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<div className="flex gap-2">
								<Button>创建新文章</Button>
								<Button variant="outline">查看统计</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>最近文章</CardTitle>
							<CardDescription>您最近创建或编辑的文章</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentArticles.map((article) => (
									<div className="flex items-center gap-4" key={article.id}>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												{article.title}
											</p>
											<p className="text-xs text-muted-foreground">
												{article.createdAt}
											</p>
										</div>
										<Badge
											variant={
												article.status === 'published' ? 'default' : 'secondary'
											}
										>
											{article.status === 'published' ? '已发布' : '草稿'}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
