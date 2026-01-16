import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface CreateProjectData {
	name: string;
	description: string;
	tags: string[];
	imageUrl?: string;
	githubUrl?: string;
	liveUrl?: string;
	order: number;
}

export function useCreateProject() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: CreateProjectData) => {
			const response = await client.api.v1.projects.post(data);
			if (!response.data?.success) {
				throw new Error('Failed to create project');
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate projects query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});

	return {
		createProject: mutation.mutate,
		createProjectAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
