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

export function useGetSlides() {
	const query = useQuery<Slide[]>({
		queryKey: ['slides'],
		queryFn: async () => {
			const response = await client.api.v1.slides.get();
			if (!response.data) {
				throw new Error('Failed to fetch slides');
			}
			return response.data.data as Slide[];
		},
	});

	return {
		slides: query.data || [],
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
