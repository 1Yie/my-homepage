import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

import type { Project } from './use-get-projects';

interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: string;
}

export function useGetProject(id: string | undefined) {
	const query = useQuery<Project>({
		queryKey: ['projects', id],
		queryFn: async () => {
			if (!id) {
				throw new Error('Project ID is required');
			}

			const response = await client.api.v1.projects({ id }).get();

			const apiResponse = response.data as ApiResponse<Project>;
			if (!apiResponse.success) {
				throw new Error('Failed to fetch project');
			}

			return apiResponse.data;
		},
		enabled: !!id,
	});

	return {
		project: query.data,
		loading: query.isLoading,
		error: query.error?.message ?? null,
		refetch: query.refetch,
	};
}
