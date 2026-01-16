import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

export function useDeleteProject() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await client.api.v1.projects({ id }).delete();
			if (!response.data?.success) {
				throw new Error('Failed to delete project');
			}
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});

	return {
		deleteProject: mutation.mutate,
		deleteProjectAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
