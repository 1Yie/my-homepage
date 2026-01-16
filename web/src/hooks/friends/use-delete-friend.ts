import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

export function useDeleteFriend() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await client.api.v1.friends({ id }).delete();
			if (!response.data?.success) {
				throw new Error(response.data?.error || 'Failed to delete friend');
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate friends query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['friends'] });
		},
	});

	return {
		deleteFriend: mutation.mutate,
		deleteFriendAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
