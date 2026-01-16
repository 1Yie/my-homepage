import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

export function useDeleteSlide() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await client.api.v1.slides({ id }).delete();
			if (!response.data?.success) {
				throw new Error('Failed to delete slide');
			}
			return response.data.data;
		},
		onSuccess: () => {
			// Invalidate slides query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['slides'] });
		},
	});

	return {
		deleteSlide: mutation.mutate,
		deleteSlideAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
