import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Tag {
	id: number;
	name: string;
	createdAt?: string;
	updatedAt?: string;
	articleCount?: number;
}

export function useGetTags() {
	const query = useQuery({
		queryKey: ['tags'],
		queryFn: async () => {
			const response = await client.api.v1.tags.get();
			if (!response.data) {
				throw new Error('Failed to fetch tags');
			}
			return response.data.data;
		},
	});

	return {
		tags: query.data || [],
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
