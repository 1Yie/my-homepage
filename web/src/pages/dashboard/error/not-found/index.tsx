import { FileQuestion, MoveLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { Button } from '@/components/ui/button';
import { useTitle } from '@/hooks/use-page-title';

export function NotFoundPage() {
	useTitle('404 - 页面未找到');
	const navigate = useNavigate();

	return (
		<div
			className="flex flex-1 flex-col items-center justify-center min-h-100
				gap-8 p-4 text-center"
		>
			{/* 视觉中心 */}
			<div className="relative">
				<div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full" />
				<FileQuestion
					className="relative h-24 w-24 text-primary animate-in zoom-in
						duration-500"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<DashboardHeaderTitle
					subtitle="抱歉，我们找不到您要访问的页面。"
					title="404 Not Found"
				/>
				<p className="text-muted-foreground text-sm max-w-100">
					该页面可能已被移动、删除，或者您输入了一个错误的地址。
				</p>
			</div>

			{/* 操作按钮组 */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Button
					className="gap-2"
					onClick={() => navigate(-1)}
					variant="outline"
				>
					<MoveLeft className="h-4 w-4" />
					返回上一页
				</Button>

				<Button className="gap-2" onClick={() => navigate('/')}>
					<Home className="h-4 w-4" />
					回到首页
				</Button>
			</div>

			{/* 装饰性底纹（可选） */}
			<div
				className="mt-8 text-[10rem] font-bold text-muted/5 absolute select-none
					-z-10"
			>
				404
			</div>
		</div>
	);
}
