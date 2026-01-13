import { LogOut } from 'lucide-react';
import {
	FileText,
	FolderKanban,
	Home,
	Images,
	LayoutDashboard,
	Tag,
	Users,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

import { authClient } from '@/api/client';
import { DashboardHeader } from '@/components/dashboard-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/menu';
import {
	Sidebar,
	SidebarContent,
	SidebarInset,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
} from '@/components/ui/sidebar';
import {
	AnchoredToastProvider,
	ToastProvider,
	toastManager,
} from '@/components/ui/toast';
import { useBreadcrumbItems } from '@/hooks/use-breadcrumb-items';
import { useIsMobile } from '@/hooks/use-mobile';

// Sidebar navigation items
const sidebarNavItems = [
	{
		title: '仪表盘',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: '文章管理',
		url: '/dashboard/articles',
		icon: FileText,
	},
	{
		title: '项目管理',
		url: '/dashboard/projects',
		icon: FolderKanban,
	},
	{
		title: '相册管理',
		url: '/dashboard/slides',
		icon: Images,
	},
	{
		title: '标签管理',
		url: '/dashboard/tags',
		icon: Tag,
	},
	{
		title: '友链管理',
		url: '/dashboard/friends',
		icon: Users,
	},
];

export function DashboardLayout() {
	const { data: session, isPending } = authClient.useSession();
	const location = useLocation();
	const breadcrumbs = useBreadcrumbItems();
	const isMobile = useIsMobile();

	// Find the active menu item - only the most specific match should be active
	const getActiveMenuItem = () => {
		// First check for exact matches
		const exactMatch = sidebarNavItems.find(
			(item) => item.url === location.pathname
		);
		if (exactMatch) return exactMatch.url;

		// Then check for prefix matches, but only for non-dashboard items and find the most specific
		const prefixMatches = sidebarNavItems
			.filter(
				(item) =>
					item.url !== '/dashboard' &&
					location.pathname.startsWith(item.url + '/')
			)
			.sort((a, b) => b.url.length - a.url.length); // Sort by length, longest first

		return prefixMatches[0]?.url;
	};

	const activeMenuItem = getActiveMenuItem();

	useEffect(() => {
		window.toast = {
			success: (message: string) => {
				toastManager.add({
					title: message,
					type: 'success',
				});
			},
			error: (message: string) => {
				toastManager.add({
					title: message,
					type: 'error',
				});
			},
			info: (message: string) => {
				toastManager.add({
					title: message,
					type: 'info',
				});
			},
			warning: (message: string) => {
				toastManager.add({
					title: message,
					type: 'warning',
				});
			},
		};
	}, []);

	if (isPending) {
		return;
	}

	if (!session) {
		return <Navigate replace state={{ from: location }} to="/auth/login" />;
	}

	return (
		<ToastProvider>
			<AnchoredToastProvider>
				<SidebarProvider>
					<Sidebar variant="inset">
						<SidebarHeader>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										render={
											<Link to="/dashboard">
												<div
													className="flex aspect-square size-8 items-center
														justify-center rounded-lg bg-sidebar-primary
														text-sidebar-primary-foreground"
												>
													<Home className="size-4" />
												</div>
												<div
													className="grid flex-1 text-left text-sm
														leading-tight"
												>
													<span className="truncate font-semibold">
														ichiyo.in
													</span>
													<span className="truncate text-xs">管理后台</span>
												</div>
											</Link>
										}
										size="lg"
									></SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarHeader>

						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupLabel>导航</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{sidebarNavItems.map((item) => (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton
													isActive={activeMenuItem === item.url}
													render={
														<Link to={item.url}>
															<item.icon />
															<span>{item.title}</span>
														</Link>
													}
												></SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>

						{/* User Info Footer */}
						<div className="mt-auto p-2">
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger
									render={
										<Button
											className="w-full flex items-center gap-2 px-2 h-auto
												py-6"
											variant="ghost"
										>
											<Avatar className="h-8 w-8">
												{session.user.image && (
													<AvatarImage
														alt={
															session.user.name || session.user.email || 'User'
														}
														src={session.user.image}
													/>
												)}
												<AvatarFallback className="text-xs">
													{(session.user.name || session.user.email || 'U')
														.charAt(0)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 text-left">
												<div className="text-sm font-medium truncate">
													{session.user.name || session.user.email}
												</div>
												<div className="text-xs text-muted-foreground truncate">
													{session.user.email}
												</div>
											</div>
										</Button>
									}
								></DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-20 rounded-lg"
									side={isMobile ? 'bottom' : 'right'}
									sideOffset={4}
								>
									<DropdownMenuItem
										onClick={() => authClient.signOut()}
										variant="destructive"
									>
										<LogOut className="mr-2 h-4 w-4" />
										登出
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<SidebarRail />
					</Sidebar>

					<SidebarInset className="min-h-screen flex-1 flex flex-col">
						<DashboardHeader breadcrumbs={breadcrumbs} />
						<div className="flex flex-1 flex-col gap-4 p-4">
							<Outlet />
						</div>
					</SidebarInset>
				</SidebarProvider>
			</AnchoredToastProvider>
		</ToastProvider>
	);
}
