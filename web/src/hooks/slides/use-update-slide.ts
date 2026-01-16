import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface UpdateSlideInput {
	title: string;
	src: string;
	button?: string;
	link?: string;
	newTab: boolean;
	order: number;
}

export function useUpdateSlide() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			input,
		}: {
			id: string;
			input: UpdateSlideInput;
		}) => {
			const response = await client.api.v1.slides({ id }).put({
				...input,
				button: input.button || undefined,
				link: input.link || undefined,
			});
			if (!response.data?.success) {
				throw new Error('Failed to update slide');
			}
			return response.data.data;
		},
		onSuccess: (_, { id }) => {
			// Invalidate both slides list and specific slide queries
			queryClient.invalidateQueries({ queryKey: ['slides'] });
			queryClient.invalidateQueries({ queryKey: ['slide', id] });
		},
	});

	return {
		updateSlide: mutation.mutate,
		updateSlideAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
