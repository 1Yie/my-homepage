import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Article {
	id: number;
	title: string;
	slug: string;
	content: string;
	headerImage: string | null;
	isDraft: boolean;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	readingTime?: number;
	views?: number;
	tags: {
		id: number;
		name: string;
	}[];
	author?: {
		id: string;
		name: string;
	};
}

interface UseGetArticlesOptions {
	public?: boolean;
	search?: string;
	preview?: boolean;
	page?: number;
	limit?: number;
}

interface PaginatedArticlesResponse {
	articles: Article[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export function useGetArticles(options: UseGetArticlesOptions = {}) {
	const query = useQuery<{
		articles: Article[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>({
		queryKey: ['articles', options],
		queryFn: async () => {
			const query: Record<string, string> = {};
			if (options.public) query.public = 'true';
			if (options.search) query.q = options.search;
			if (options.preview) query.preview = 'true';
			if (options.page) query.page = options.page.toString();
			if (options.limit) query.limit = options.limit.toString();
			const response = await client.api.v1.articles.get({
				query,
			});
			if (!response.data) {
				throw new Error('Failed to fetch articles');
			}

			const data = response.data.data;

			if (Array.isArray(data)) {
				return {
					articles: data,
					total: data.length,
					page: 1,
					limit: data.length,
					totalPages: 1,
				};
			} else if (data && typeof data === 'object' && 'articles' in data) {
				// Paginated response
				return data as PaginatedArticlesResponse;
			} else {
				throw new Error('Unexpected response format');
			}
		},
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
