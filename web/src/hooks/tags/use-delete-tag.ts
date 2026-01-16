import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

export function useDeleteTag() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await client.api.v1.tags({ id }).delete();
			if (!response.data?.success) {
				throw new Error(response.data?.error || 'Failed to delete tag');
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate tags query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['tags'] });
		},
	});

	return {
		deleteTag: mutation.mutate,
		deleteTagAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
