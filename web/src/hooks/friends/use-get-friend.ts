import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

import type { Friend } from './use-get-friends';

interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: string;
}

export function useGetFriend(id: string | undefined) {
	const query = useQuery<Friend>({
		queryKey: ['friends', id],
		queryFn: async () => {
			if (!id) {
				throw new Error('Friend ID is required');
			}

			const response = await client.api.v1.friends({ id }).get();

			const apiResponse = response.data as ApiResponse<Friend>;
			if (!apiResponse.success) {
				throw new Error('Failed to fetch friend');
			}

			return apiResponse.data;
		},
		enabled: !!id,
	});

	return {
		friend: query.data,
		loading: query.isLoading,
		error: query.error?.message ?? null,
		refetch: query.refetch,
	};
}
