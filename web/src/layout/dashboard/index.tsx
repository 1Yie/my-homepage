import {
	FileText,
	FolderKanban,
	Home,
	Images,
	LayoutDashboard,
	Tag,
} from 'lucide-react';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';

import { authClient } from '@/api/client';
import { DashboardHeader } from '@/components/dashboard-header';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
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
];

// Generate breadcrumbs based on current path
const generateBreadcrumbs = (pathname: string) => {
	const pathSegments = pathname.split('/').filter(Boolean);
	const breadcrumbs: Array<{ label: string; href?: string }> = [];

	if (pathSegments.length >= 1) {
		breadcrumbs.push({ label: '后台管理', href: '/dashboard' });
	}

	if (pathSegments.length > 1) {
		const currentItem = sidebarNavItems.find(
			(item) =>
				item.url === `/${pathSegments.join('/')}` ||
				item.url === `/${pathSegments.slice(0, 2).join('/')}`
		);
		if (currentItem) {
			breadcrumbs.push({ label: currentItem.title, href: currentItem.url });

			// Handle create/edit pages
			if (pathSegments.length > 2) {
				const section = pathSegments[1];
				if (pathSegments[2] === 'create') {
					const labels: Record<string, string> = {
						articles: '创建文章',
						projects: '创建项目',
						slides: '添加图片',
						tags: '创建标签',
					};
					breadcrumbs.push({ label: labels[section] || '创建' });
				} else if (pathSegments[2] === 'edit') {
					const labels: Record<string, string> = {
						articles: '编辑文章',
						projects: '编辑项目',
						slides: '编辑图片',
						tags: '编辑标签',
					};
					breadcrumbs.push({ label: labels[section] || '编辑' });
				}
			}
		}
	}

	// If on dashboard root, remove the href to make it the current page
	if (pathname === '/dashboard') {
		breadcrumbs[0] = { label: '后台管理' };
	}

	return breadcrumbs;
};

export function DashboardLayout() {
	const { data: session, isPending } = authClient.useSession();
	const location = useLocation();

	const breadcrumbs = generateBreadcrumbs(location.pathname);

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

	// Show loading while checking authentication
	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<p className="text-muted-foreground">正在验证身份...</p>
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
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

						<SidebarRail />
					</Sidebar>

					<SidebarInset>
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
