import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface DashboardData {
	overview: {
		totalArticles: number;
		publishedArticles: number;
		draftArticles: number;
		totalProjects: number;
		totalSlides: number;
		totalTags: number;
		totalFriends: number;
		totalUsers: number;
		totalArticleViews: number;
	};
	recentArticles: Array<{
		id: number;
		title: string;
		slug: string;
		views: number;
		isDraft: boolean;
		createdAt: Date;
		updatedAt: Date;
		author: {
			id: string;
			name: string;
			email: string;
		};
		tags: Array<{
			id: number;
			name: string;
		}>;
	}>;
	recentProjects: Array<{
		id: number;
		name: string;
		description: string;
		tags: string[];
		imageUrl: string | null;
		githubUrl: string | null;
		liveUrl: string | null;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}>;
	recentSlides: Array<{
		id: number;
		title: string;
		src: string;
		button: string | null;
		link: string | null;
		newTab: boolean;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}>;
	recentFriends: Array<{
		id: number;
		name: string;
		image: string;
		description: string;
		pinned: boolean;
		order: number;
		createdAt: Date;
		updatedAt: Date;
	}>;
	articlesByMonth: Array<{
		month: string;
		count: number;
		publishedCount: number;
		draftCount: number;
	}>;
	topTags: Array<{
		id: number;
		name: string;
		articleCount: number;
	}>;
	articleStatusDistribution: {
		published: number;
		draft: number;
	};
	recentActivityTrend: Array<{
		date: string;
		articlesCreated: number;
		projectsCreated: number;
		slidesCreated: number;
	}>;
}

export function useDashboardStats() {
	const query = useQuery<DashboardData>({
		queryKey: ['dashboard', 'stats'],
		queryFn: async () => {
			const response = await client.api.v1.dashboard.stats.get();
			if (!response.data || !response.data.success) {
				throw new Error('Failed to fetch dashboard stats');
			}
			return response.data.data as DashboardData;
		},
	});

	return {
		dashboardData: query.data,
		loading: query.isLoading,
		error: query.error?.message || null,
	};
}
