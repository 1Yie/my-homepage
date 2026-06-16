import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

/** Artalk 评论详情 */
export interface ArtalkCommentDetail {
	id: number;
	nick: string;
	content: string;
	contentMarked: string;
	/** 邮箱 SHA256 哈希，可用于生成 Gravatar 头像 */
	emailEncrypted: string;
	date: string;
	pageKey: string;
	pageUrl: string;
	link: string;
	ua: string;
	isPending: boolean;
	isPinned: boolean;
	isVerified: boolean;
	voteUp: number;
	voteDown: number;
	rid: number;
	badgeName: string;
	badgeColor: string;
}

/**
 * 获取 Artalk 评论列表
 */
export function useArtalkComments() {
	const query = useQuery<ArtalkCommentDetail[]>({
		queryKey: ['dashboard', 'comments'],
		queryFn: async () => {
			const response = await client.api.v1.dashboard.comments.get();
			if (!response.data || !response.data.success) {
				throw new Error('获取评论列表失败');
			}
			return response.data.data as ArtalkCommentDetail[];
		},
	});

	return {
		comments: query.data ?? [],
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
