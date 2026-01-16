import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface UpdateFriendData {
	name: string;
	image: string;
	description: string;
	pinned: boolean;
	order: number;
	socialLinks: Array<{
		name: string;
		link: string;
		iconLight: string;
		iconDark: string;
	}>;
}

export function useUpdateFriend() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateFriendData;
		}) => {
			const response = await client.api.v1.friends({ id }).put(data);
			if (!response.data?.success) {
				throw new Error(response.data?.error || 'Failed to update friend');
			}
			return response.data;
		},
		onSuccess: (_, { id }) => {
			// Invalidate both friends list and specific friend queries
			queryClient.invalidateQueries({ queryKey: ['friends'] });
			queryClient.invalidateQueries({ queryKey: ['friends', id] });
		},
	});

	return {
		updateFriend: mutation.mutate,
		updateFriendAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
