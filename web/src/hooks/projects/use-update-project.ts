import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface UpdateProjectData {
	name: string;
	description: string;
	tags: string[];
	imageUrl?: string;
	githubUrl?: string;
	liveUrl?: string;
	order: number;
}

export function useUpdateProject() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateProjectData;
		}) => {
			const response = await client.api.v1.projects({ id }).put(data);
			if (!response.data?.success) {
				throw new Error(response.data?.error || 'Failed to update project');
			}
			return response.data;
		},
		onSuccess: (_, { id }) => {
			// Invalidate both projects list and specific project queries
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			queryClient.invalidateQueries({ queryKey: ['projects', id] });
		},
	});

	return {
		updateProject: mutation.mutate,
		updateProjectAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
