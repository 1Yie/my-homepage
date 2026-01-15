import {
	Moon,
	Sun,
	TextAlignJustify,
	User,
	LogOut,
	Github,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { authClient } from '@/api/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/use-theme';

const SystemIcon = () => (
	<svg
		className="size-4.5"
		fill="none"
		height="24"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="1.8"
		viewBox="0 0 24 24"
		width="24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M0 0h24v24H0z" fill="none" stroke="none" />
		<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
		<path d="M12 3l0 18" />
		<path d="M12 9l4.65 -4.65" />
		<path d="M12 14.3l7.37 -7.37" />
		<path d="M12 19.6l8.85 -8.85" />
	</svg>
);

const navigation = [
	{ name: '首页', href: '/' },
	{ name: '博客', href: '/blog' },
	{ name: '关于', href: '/about' },
	{ name: '友链', href: '/links' },
];

export function Header() {
	const location = useLocation();
	const navigate = useNavigate();
	const { isDark, theme, toggleTheme } = useTheme();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { data: session } = authClient.useSession();

	return (
		<header
			className="bg-background/80 sticky top-0 right-0 left-0 z-10 border-b h-14
				pr-(--removed-body-scroll-bar-size,0px) backdrop-blur-sm"
		>
			<section className="section-base">
				<div
					className="relative flex h-14 items-center justify-between px-4
						sm:px-8"
				>
					{/* Logo */}
					<div className="font-satisfy flex items-center space-x-4">
						<Link className="text-primary text-xl" to="/">
							ichiyo
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center">
						{navigation.map((item, index) => (
							<Fragment key={item.name}>
								<Link
									className={`px-3 py-2 text-sm font-medium transition-colors ${
										location.pathname === item.href
											? 'text-primary'
											: 'text-muted-foreground hover:text-primary'
									}`}
									to={item.href}
								>
									{item.name}
								</Link>

								{index < navigation.length - 1 && (
									<span className="mx-1 text-muted-foreground">/</span>
								)}
							</Fragment>
						))}
						<Tooltip>
							<TooltipTrigger
								render={
									<Button
										className="ml-2"
										onClick={toggleTheme}
										size="icon"
										variant="ghost"
									>
										{theme === 'system' ? (
											<SystemIcon />
										) : isDark ? (
											<Moon className="h-5 w-5" />
										) : (
											<Sun className="h-5 w-5" />
										)}
									</Button>
								}
							></TooltipTrigger>
							<TooltipContent>
								{theme === 'system'
									? '切换到浅色模式'
									: theme === 'light'
										? '切换到深色模式'
										: '跟随系统'}
							</TooltipContent>
						</Tooltip>
						{session ? (
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger
									render={
										<Button
											className="ml-4 flex items-center gap-2 px-2"
											variant="ghost"
										>
											<Avatar className="h-6 w-6">
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
											<span className="text-sm text-muted-foreground">
												{session.user.name || session.user.email}
											</span>
										</Button>
									}
								/>
								<DropdownMenuContent align="center" className="w-auto">
									<DropdownMenuItem onClick={() => navigate('/dashboard')}>
										<User className="mr-2 h-4 w-4" />
										<span className="text-accent-foreground">仪表盘</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => authClient.signOut()}
										variant="destructive"
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span className="destructive-foreground">登出</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								className="ml-4"
								onClick={() => navigate('/auth/login')}
								size="sm"
							>
								<Github className="text-accent" />
							</Button>
						)}
					</nav>

					{/* Mobile Navigation */}
					<div
						className="flex justify-end sm:w-auto sm:justify-center md:hidden"
					>
						<Sheet onOpenChange={setMobileMenuOpen} open={mobileMenuOpen}>
							<SheetTrigger
								render={
									<Button size="icon" variant="ghost">
										<TextAlignJustify className="h-5 w-5" />
									</Button>
								}
							></SheetTrigger>
							<SheetContent
								className="w-full border-b"
								showCloseButton={false}
								side="top"
							>
								<div className="flex flex-col gap-4 p-4">
									{/* Mobile Logo */}
									<div className="font-satisfy flex items-center justify-center">
										<Link className="text-primary text-xl" to="/">
											ichiyo
										</Link>
									</div>

									{/* Mobile Navigation */}
									<nav className="flex flex-col gap-2">
										{navigation.map((item, index) => (
											<Fragment key={item.name}>
												<Button
													className="justify-start w-full"
													onClick={() => {
														navigate(item.href);
														setMobileMenuOpen(false);
													}}
													size="sm"
													variant={
														location.pathname === item.href
															? 'secondary'
															: 'ghost'
													}
												>
													{item.name}
												</Button>
												{index < navigation.length - 1 && (
													<div className="h-px bg-border/60" />
												)}
											</Fragment>
										))}
										<div className="h-px bg-border/60 my-1" />
										<Button
											className="justify-start w-full"
											onClick={() => {
												toggleTheme();
											}}
											size="sm"
											variant="ghost"
										>
											{theme === 'system' ? (
												<SystemIcon />
											) : isDark ? (
												<Moon className="h-5 w-5 mr-2" />
											) : (
												<Sun className="h-5 w-5 mr-2" />
											)}
											{theme === 'system'
												? '跟随系统'
												: isDark
													? '深色模式'
													: '浅色模式'}
										</Button>
										<div className="h-px bg-border/60 my-1" />
										{session ? (
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Avatar className="h-9 w-9">
														{session.user.image && (
															<AvatarImage
																alt={
																	session.user.name ||
																	session.user.email ||
																	'User'
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
													<span className="text-base text-muted-foreground">
														{session.user.name || session.user.email}
													</span>
												</div>
												<div className="flex gap-2">
													<Button
														onClick={() => {
															navigate('/dashboard');
															setMobileMenuOpen(false);
														}}
														size="sm"
														variant="outline"
													>
														<User className="mr-2 h-4 w-4" />
														仪表盘
													</Button>
													<Button
														onClick={() => {
															authClient.signOut();
															setMobileMenuOpen(false);
														}}
														size="sm"
														variant="destructive-outline"
													>
														<LogOut className="mr-2 h-4 w-4" />
														<span className="destructive-foreground">登出</span>
													</Button>
												</div>
											</div>
										) : (
											<Button
												className="w-10"
												onClick={() => {
													navigate('/auth/login');
													setMobileMenuOpen(false);
												}}
												size="icon"
											>
												<Github className="text-accent" />
											</Button>
										)}
									</nav>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</section>
		</header>
	);
}
