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
			const response = await client.articles['slug']({ slug }).get();
			if (!response.data) {
				throw new Error('Failed to fetch article');
			}
			return response.data.data;
		},
		enabled: !!slug,
	});

	return {
		article: query.data,
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
