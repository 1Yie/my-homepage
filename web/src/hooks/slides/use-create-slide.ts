import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface CreateSlideInput {
	title: string;
	src: string;
	button?: string;
	link?: string;
	newTab: boolean;
	order: number;
}

export function useCreateSlide() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateSlideInput) => {
			const response = await client.api.v1.slides.post({
				...input,
				button: input.button || undefined,
				link: input.link || undefined,
			});
			if (!response.data?.success) {
				throw new Error('Failed to create slide');
			}
			return response.data.data;
		},
		onSuccess: () => {
			// Invalidate and refetch slides query
			queryClient.invalidateQueries({ queryKey: ['slides'] });
		},
	});

	return {
		createSlide: mutation.mutate,
		createSlideAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
