import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface SocialLink {
	id: number;
	name: string;
	link: string;
	iconLight: string;
	iconDark: string;
	friendId?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface Friend {
	id: number;
	name: string;
	image: string;
	description: string;
	pinned: boolean;
	order: number;
	createdAt: string | Date;
	updatedAt: string | Date;
	socialLinks: SocialLink[];
}

export function useGetFriends(search?: string) {
	const query = useQuery({
		queryKey: ['friends', search],
		queryFn: async () => {
			const queryObj: Record<string, string> = {};
			if (search) queryObj.q = search;
			const response = await client.api.v1.friends.get({ query: queryObj });
			if (!response.data) {
				throw new Error('Failed to fetch friends');
			}
			return (response.data.data || []) as Friend[];
		},
	});

	return {
		friends: query.data || [],
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
