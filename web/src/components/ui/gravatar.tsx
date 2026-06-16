import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

interface GravatarProps extends ComponentProps<'img'> {
	/** 邮箱 SHA256 哈希 */
	hash: string;
	/** 头像昵称（用于 fallback 首字母） */
	nick: string;
	/** 头像尺寸（px），默认 40 */
	size?: number;
}

/**
 * Gravatar 头像组件
 * 使用邮箱的 SHA256 哈希生成 Gravatar 头像
 * 当头像加载失败时显示昵称首字母
 */
export function Gravatar({
	hash,
	nick,
	size = 40,
	className,
	...props
}: GravatarProps) {
	const src = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size * 2}`;

	return (
		<img
			alt={`${nick} 的头像`}
			className={cn('rounded-full shrink-0 bg-muted object-cover', className)}
			height={size}
			src={src}
			style={{ width: size, height: size }}
			width={size}
			{...props}
		/>
	);
}

/**
 * 获取 Gravatar 头像 URL
 */
export function getGravatarUrl(hash: string, size = 40): string {
	return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size * 2}`;
}
