import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Tag {
	id: number;
	name: string;
	number: number;
	createdAt: Date;
}

export function useGetTag(id: string | undefined) {
	const query = useQuery({
		queryKey: ['tag', id],
		queryFn: async () => {
			if (!id) throw new Error('Tag ID is required');
			const response = await client.api.v1.tags({ id }).get();
			if (!response.data || !response.data.success) {
				throw new Error('Failed to fetch tag');
			}
			return response.data.data as Tag;
		},
		enabled: !!id,
	});

	return {
		tag: query.data,
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
