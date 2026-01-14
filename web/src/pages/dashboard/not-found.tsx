import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useTitle } from '@/hooks/use-page-title';

export function DashboardNotFoundPage() {
	useTitle('页面未找到', { hasSuffix: false });
	return (
		<div className="flex h-[50vh] flex-col items-center justify-center">
			<div className="text-center">
				<h1 className="mb-4 text-4xl font-bold">404</h1>
				<p className="mb-6 text-muted-foreground">您访问的仪表盘页面不存在</p>
				<Button asChild>
					<Link to="/dashboard">返回仪表盘</Link>
				</Button>
			</div>
		</div>
	);
}
