import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Article {
	id: number;
	title: string;
	slug: string;
	content: string;
	isDraft: boolean;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	headerImage: string | null;
	tags: Array<{
		id: number;
		name: string;
	}>;
	author: {
		id: string;
		name: string;
		email: string;
	};
}

export function useGetArticle(id: string | undefined) {
	const query = useQuery({
		queryKey: ['article', id],
		queryFn: async () => {
			if (!id) throw new Error('Article ID is required');
			const response = await client.api.v1.articles({ id }).get();
			if (response.error) {
				if (Number(response.error.status) === 404) {
					throw new Error('404');
				}
				throw new Error('Failed to fetch article');
			}
			if (!response.data || !response.data.success) {
				throw new Error('Failed to fetch article');
			}
			return response.data.data as Article;
		},
		enabled: !!id,
	});

	return {
		article: query.data,
		loading: query.isLoading,
		error: query.error?.message || null,
		isNotFound: query.error?.message === '404',
	};
}
