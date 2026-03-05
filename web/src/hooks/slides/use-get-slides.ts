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

export function useGetSlides(search?: string) {
	const query = useQuery<Slide[]>({
		queryKey: ['slides', search],
		queryFn: async () => {
			const queryObj: Record<string, string> = {};
			if (search) queryObj.q = search;

			const response = await client.api.v1.slides.get({ query: queryObj });
			if (!response.data || !response.data.success) {
				throw new Error('Failed to fetch slides');
			}

			return response.data.data as Slide[];
		},
	});

	return {
		slides: (query.data ?? []) as Slide[],
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
