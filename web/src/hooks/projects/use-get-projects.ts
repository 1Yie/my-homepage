import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Project {
	id: number;
	name: string;
	description: string;
	tags: string[];
	imageUrl?: string | null;
	githubUrl?: string | null;
	liveUrl?: string | null;
	order: number;
	createdAt: string | Date;
	updatedAt: string | Date;
}

interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: string;
}

export function useGetProjects() {
	const query = useQuery<Project[]>({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await client.api.v1.projects.get();

			const apiResponse = response.data as ApiResponse<Project[]>;
			if (!apiResponse.success) {
				throw new Error('Failed to fetch projects');
			}

			return apiResponse.data;
		},
	});

	return {
		projects: query.data ?? [],
		loading: query.isLoading,
		error: query.error?.message ?? null,
		refetch: query.refetch,
	};
}
