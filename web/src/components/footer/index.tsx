import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';
import { FaBluesky } from 'react-icons/fa6';
import { FaTelegram } from 'react-icons/fa6';
import { FaEnvelope } from 'react-icons/fa6';
import { FaBilibili } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

const ICP_CONFIG = {
	name: '',
	url: '',
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

					<div className="flex justify-end sm:w-auto sm:justify-center">
						{/* 移动端 */}
						<div className="flex sm:hidden">
							<div className="flex flex-row gap-2">
								<SocialIconLink href="mailto:me@ichiyo.in">
									<FaEnvelope size={22} />
								</SocialIconLink>
								<SocialIconLink href="https://github.com/1Yie">
									<FaGithub size={22} />
								</SocialIconLink>
								<SocialIconLink href="https://x.com/IchiyoNico">
									<FaXTwitter size={22} />
								</SocialIconLink>
							</div>
						</div>

						{/* 桌面端显示全部社交图标 */}
						<div className="hidden sm:flex">
							<div className="flex flex-row gap-2">
								<SocialIconLink href="mailto:me@ichiyo.in">
									<FaEnvelope size={22} />
								</SocialIconLink>

								<SocialIconLink href="https://space.bilibili.com/35020597">
									<FaBilibili size={22} />
								</SocialIconLink>

								<SocialIconLink href="https://github.com/1Yie">
									<FaGithub size={22} />
								</SocialIconLink>

								<SocialIconLink href="https://x.com/IchiyoNico">
									<FaXTwitter size={22} />
								</SocialIconLink>

								<SocialIconLink href="https://t.me/ichiyo233">
									<FaTelegram size={22} />
								</SocialIconLink>

								<SocialIconLink href="https://bsky.app/profile/ichiyo.in">
									<FaBluesky size={22} />
								</SocialIconLink>
							</div>
						</div>
					</div>
				</div>
			</section>
		</footer>
	);
}
