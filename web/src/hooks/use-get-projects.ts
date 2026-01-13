import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Project {
	id: number;
	name: string;
	description: string;
	tags: string[];
	githubUrl?: string;
	liveUrl?: string;
	imageUrl?: string;
	order: number;
}

export function useGetProjects() {
	const query = useQuery<Project[]>({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await client.projects.get();
			if (!response.data) {
				throw new Error('Failed to fetch projects');
			}
			return response.data.data as Project[];
		},
	});

	return {
		projects: query.data || [],
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
