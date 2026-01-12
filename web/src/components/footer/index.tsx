import { useState } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

const ICP_CONFIG = {
	name: '',
	url: '',
};

const ICONS = {
	MAIL: (
		<svg
			className="h-6 w-6"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			viewBox="0 0 24 24"
		>
			<path
				d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	GITHUB: (
		<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	),
	BILIBILI: (
		<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
			<path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z" />
		</svg>
	),
	X: (
		<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
			<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
		</svg>
	),
	TELEGRAM: (
		<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
			<path d="M11.944 0C5.347 0 0 5.347 0 11.944c0 6.595 5.347 11.944 11.944 11.944 6.596 0 11.944-5.349 11.944-11.944C23.888 5.347 18.54 0 11.944 0zm5.835 8.169l-1.975 9.309c-.149.658-.539.822-1.088.513l-3.012-2.218-1.453 1.398c-.161.161-.296.296-.606.296l.216-3.061 5.572-5.035c.243-.216-.054-.337-.377-.121L8.12 13.7l-2.969-.927c-.645-.202-.658-.645.135-.955l11.597-4.471c.539-.196 1.011.128.896.822z" />
		</svg>
	),
};

const SocialIconLink = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) => (
	<a
		className={cn(
			'text-gray-400 transition-all duration-300',
			'hover:text-primary hover:scale-110 active:scale-95'
		)}
		href={href}
		rel="noopener noreferrer"
		target="_blank"
	>
		{children}
	</a>
);

export function Footer() {
	const [currentYear] = useState(() => new Date().getFullYear());

	return (
		<footer className="w-full border-t">
			<section className="section-base">
				<div
					className="relative flex h-14 items-center justify-between px-4
						sm:px-8"
				>
					{/* 左侧：Logo 和移动端版权 */}
					<div className="flex items-center space-x-4">
						<Link
							className="font-satisfy text-xl text-primary transition-opacity
								hover:opacity-80"
							to="/"
						>
							ichiyo
						</Link>

						<div
							className="flex md:hidden flex-col space-y-0.5 text-[10px]
								font-mono tracking-tight text-gray-500"
						>
							<p className="font-jb-mono text-xs">
								Copyright © {currentYear} ichiyo
							</p>
							<div className="flex items-center gap-1.5 opacity-70">
								{ICP_CONFIG.name && (
									<a
										className="hover:text-primary transition-colors"
										href={ICP_CONFIG.url}
										rel="noreferrer"
										target="_blank"
									>
										{ICP_CONFIG.name}
									</a>
								)}
							</div>
						</div>
					</div>

					{/* 绝对居中 */}
					<div
						className="absolute left-1/2 -translate-x-1/2 hidden md:flex
							flex-col items-center space-y-0 text-xs font-mono tracking-tight
							text-gray-500"
					>
						<p className="text-center font-jb-mono text-sm">
							Copyright © {currentYear} ichiyo
						</p>
						<div className="flex items-center gap-1.5 opacity-70 justify-center">
							{ICP_CONFIG.name && (
								<a
									className="hover:text-primary transition-colors"
									href={ICP_CONFIG.url}
									rel="noreferrer"
									target="_blank"
								>
									{ICP_CONFIG.name}
								</a>
							)}
						</div>
					</div>

					{/* 右侧：社交图标 */}
					<div className="flex items-center gap-3 sm:gap-5">
						<SocialIconLink href="mailto:me@ichiyo.in">
							{ICONS.MAIL}
						</SocialIconLink>
						<SocialIconLink href="https://github.com/1Yie">
							{ICONS.GITHUB}
						</SocialIconLink>
						<span className="mx-1 text-muted-foreground">/</span>
						<SocialIconLink href="https://space.bilibili.com/35020597">
							{ICONS.BILIBILI}
						</SocialIconLink>
						<SocialIconLink href="https://x.com/IchiyoNico">
							{ICONS.X}
						</SocialIconLink>
						<SocialIconLink href="https://t.me/ichiyo233">
							{ICONS.TELEGRAM}
						</SocialIconLink>
					</div>
				</div>
			</section>
		</footer>
	);
}
