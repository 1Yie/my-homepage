import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface UpdateTagData {
	name: string;
}

export function useUpdateTag() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateTagData }) => {
			const response = await client.api.v1.tags({ id }).put(data);
			if (!response.data?.success) {
				throw new Error(response.data?.error || 'Failed to update tag');
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate tags query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['tags'] });
		},
	});

	return {
		updateTag: mutation.mutate,
		updateTagAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
