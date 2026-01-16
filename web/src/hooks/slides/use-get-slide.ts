import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface Slide {
	id: number;
	title: string;
	src: string;
	button?: string;
	link?: string;
	newTab?: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

interface ApiResponse<T> {
	success: boolean;
	data: T;
}

export function useGetSlide(id: string | undefined) {
	const query = useQuery<Slide>({
		queryKey: ['slide', id],
		queryFn: async () => {
			if (!id) {
				throw new Error('Slide ID is required');
			}
			const response = await client.api.v1.slides({ id }).get();
			const apiResponse = response.data as ApiResponse<Slide>;
			if (!apiResponse.success || !apiResponse.data) {
				throw new Error('Failed to fetch slide');
			}
			return apiResponse.data;
		},
		enabled: !!id,
	});

	return {
		slide: query.data,
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
