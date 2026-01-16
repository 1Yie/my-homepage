import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Tag {
	id: number;
	name: string;
	number: number;
	createdAt: Date;
	updatedAt: Date;
}

interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: string;
}

export function useGetTags(isPublic: boolean = false) {
	const query = useQuery<Tag[]>({
		queryKey: ['tags', isPublic ? 'public' : 'auth'],
		queryFn: async () => {
			const response = await client.api.v1.tags.get(
				isPublic ? { query: { public: 'true' } } : {}
			);

			const apiResponse = response.data as ApiResponse<Tag[]>;
			if (!apiResponse.success) {
				throw new Error('Failed to fetch tags');
			}

			return apiResponse.data;
		},
	});

	return {
		tags: query.data ?? [],
		loading: query.isLoading,
		error: query.error?.message ?? null,
	};
}
