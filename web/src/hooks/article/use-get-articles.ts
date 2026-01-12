import { useEffect, useState } from 'react';

import { client } from '@/api/client';

interface Article {
	id: number;
	slug: string;
	content: string;
	headerImage: string | null;
	isDraft: boolean;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	tags: {
		id: number;
		name: string;
	}[];
	author?: {
		id: string;
		name: string;
	};
}

interface UseGetArticlesOptions {
	public?: boolean;
}

export function useGetArticles(options: UseGetArticlesOptions = {}) {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				setLoading(true);
				const query = options.public ? { public: 'true' } : {};
				const response = await client.articles.get({
					query,
				});
				if (response.data) {
					setArticles(response.data.data);
				} else {
					setError('Failed to fetch articles');
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		};

		fetchArticles();
	}, [options.public]);

	return { articles, loading, error };
}
