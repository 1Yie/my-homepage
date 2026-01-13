import { cn } from '@/lib/utils';

interface DashboardHeaderTitleProps {
	title: string;
	subtitle?: string;
	className?: string;
}

export function DashboardHeaderTitle({
	title,
	subtitle,
	className,
}: DashboardHeaderTitleProps) {
	return (
		<div className={cn('flex flex-col gap-1', className)}>
			<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
			{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
		</div>
	);
}
