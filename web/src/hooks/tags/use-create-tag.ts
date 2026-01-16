import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface CreateTagData {
	name: string;
}

export function useCreateTag() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: CreateTagData) => {
			const response = await client.api.v1.tags.post(data);
			if (!response.data?.success) {
				throw new Error(response.data?.error || 'Failed to create tag');
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate tags query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['tags'] });
		},
	});

	return {
		createTag: mutation.mutate,
		createTagAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
