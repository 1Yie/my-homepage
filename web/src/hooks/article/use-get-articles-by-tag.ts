import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

interface UseGetArticlesByTagOptions {
	tagName: string;
	page?: number;
	limit?: number;
}

interface PaginatedArticlesResponse {
	articles: {
		id: number;
		title: string;
		slug: string;
		content: string;
		headerImage: string | null;
		isDraft: boolean;
		createdAt: Date;
		updatedAt: Date;
		authorId: string;
		tags: {
			id: number;
			name: string;
		}[];
		author?: {
			id: string;
			name: string;
		};
	}[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export function useGetArticlesByTag(options: UseGetArticlesByTagOptions) {
	const query = useQuery<PaginatedArticlesResponse>({
		queryKey: ['articles-by-tag', options],
		queryFn: async () => {
			const query: Record<string, string> = {};
			if (options.page) query.page = options.page.toString();
			if (options.limit) query.limit = options.limit.toString();

			const response = await client.articles['tag']({
				tagName: options.tagName,
			}).get({
				query,
			});

			if (!response.data) {
				throw new Error('Failed to fetch articles by tag');
			}

			return response.data.data as PaginatedArticlesResponse;
		},
		enabled: !!options.tagName,
	});

	return {
		articles: query.data?.articles || [],
		total: query.data?.total || 0,
		page: query.data?.page || 1,
		limit: query.data?.limit || 10,
		totalPages: query.data?.totalPages || 0,
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
