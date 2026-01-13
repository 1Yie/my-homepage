import React from 'react';
import { Link } from 'react-router-dom';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
	breadcrumbs?: Array<{
		label: string;
		href?: string;
	}>;
}

export function DashboardHeader({ breadcrumbs = [] }: DashboardHeaderProps) {
	// Last breadcrumb item is usually the current page
	const isLastItem = (index: number) => index === breadcrumbs.length - 1;

	return (
		<header
			className="sticky rounded-t-xl top-0 z-50 flex h-12 shrink-0 items-center
				gap-2 border-b bg-background px-4"
		>
			<SidebarTrigger className="-ml-1" />
			<Separator className="mr-2 h-4" orientation="vertical" />
			{breadcrumbs.length > 0 && (
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((crumb, index) => (
							<React.Fragment key={crumb.label}>
								{index > 0 && (
									<BreadcrumbSeparator className="hidden md:block" />
								)}
								<BreadcrumbItem>
									{crumb.href ? (
										<Link
											className={`hover:text-accent-foreground ${
												isLastItem(index) ? 'font-medium text-primary' : ''
											}`}
											to={crumb.href}
										>
											{crumb.label}
										</Link>
									) : (
										<BreadcrumbPage
											className={
												isLastItem(index) ? 'font-medium text-primary' : ''
											}
										>
											{crumb.label}
										</BreadcrumbPage>
									)}
								</BreadcrumbItem>
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			)}
		</header>
	);
}
