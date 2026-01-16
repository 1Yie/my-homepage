import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface CreateFriendData {
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

export function useCreateFriend() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: CreateFriendData) => {
			const response = await client.api.v1.friends.post(data);
			if (!response.data?.success) {
				throw new Error(response.data?.error || 'Failed to create friend');
			}
			return response.data;
		},
		onSuccess: () => {
			// Invalidate friends query to refetch the list
			queryClient.invalidateQueries({ queryKey: ['friends'] });
		},
	});

	return {
		createFriend: mutation.mutate,
		createFriendAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
