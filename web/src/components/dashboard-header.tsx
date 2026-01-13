import { User, LogOut } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { authClient } from '@/api/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
	breadcrumbs?: Array<{
		label: string;
		href?: string;
	}>;
}

export function DashboardHeader({ breadcrumbs = [] }: DashboardHeaderProps) {
	const { data: session } = authClient.useSession();

	return (
		<header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
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
											className="hover:text-accent-foreground"
											to={crumb.href}
										>
											{crumb.label}
										</Link>
									) : (
										<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
									)}
								</BreadcrumbItem>
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			)}
			<div className="ml-auto flex items-center gap-2">
				{session && (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									className="flex items-center gap-2 px-2"
									variant="ghost"
								>
									<Avatar className="h-6 w-6">
										{session.user.image && (
											<AvatarImage
												alt={session.user.name || session.user.email || 'User'}
												src={session.user.image}
											/>
										)}
										<AvatarFallback className="text-xs">
											{(session.user.name || session.user.email || 'U')
												.charAt(0)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span
										className="hidden text-sm text-muted-foreground sm:inline"
									>
										{session.user.name || session.user.email}
									</span>
								</Button>
							}
						></DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								个人资料
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => authClient.signOut()}
								variant="destructive"
							>
								<LogOut className="mr-2 h-4 w-4" />
								登出
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
}
