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
	tags: {
		id: number;
		name: string;
	}[];
	author?: {
		id: string;
		name: string;
	};
}

export function useGetArticleBySlug(slug: string | undefined) {
	const query = useQuery({
		queryKey: ['article', slug],
		queryFn: async () => {
			if (!slug) throw new Error('Slug is required');
			const response = await client.api.v1.articles['slug']({ slug }).get();
			if (response.error) {
				if (Number(response.error.status) === 404) {
					throw new Error('404');
				}
				throw new Error('Failed to fetch article');
			}
			if (!response.data) {
				throw new Error('Failed to fetch article');
			}
			return response.data.data;
		},
		enabled: !!slug,
		retry: (failureCount, error) => {
			if (error.message === '404') return false;
			return failureCount < 3;
		},
	});

	return {
		article: query.data,
		loading: query.isLoading,
		error: query.error?.message === '404' ? null : query.error?.message || null,
		isNotFound: query.error?.message === '404',
	};
}
