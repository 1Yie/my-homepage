import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

export function useDeleteArticle() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await client.api.v1.articles({ id }).delete();
			if (!response.data || !response.data.success) {
				throw new Error('Failed to delete article');
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: ['articles'] });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});

	return {
		deleteArticle: mutation.mutate,
		deleteArticleAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
