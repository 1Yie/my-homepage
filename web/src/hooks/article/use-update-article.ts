import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/api/client';

interface UpdateArticleData {
	id: string;
	title: string;
	slug: string;
	content: string;
	isDraft: boolean;
	tagIds: number[];
	tagNames: string[]; // New tag names to create
	headerImage: string;
}

export function useUpdateArticle() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: UpdateArticleData) => {
			// First, create any new tags
			const newTagIds: number[] = [];
			for (const tagName of data.tagNames) {
				const response = await client.api.v1.tags.post({
					name: tagName,
				});
				if (response.data) {
					newTagIds.push(response.data.data.id);
				}
			}

			const allTagIds = [...data.tagIds, ...newTagIds];

			// Then update the article
			const response = await client.api.v1.articles({ id: data.id }).put({
				title: data.title,
				slug: data.slug,
				content: data.content,
				isDraft: data.isDraft,
				tagIds: allTagIds,
				headerImage: data.headerImage,
			});

			if (!response.data || !response.data.success) {
				throw new Error('Failed to update article');
			}

			return response.data;
		},
		onSuccess: () => {
			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: ['articles'] });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			queryClient.invalidateQueries({ queryKey: ['tags'] });
		},
	});

	return {
		updateArticle: mutation.mutate,
		updateArticleAsync: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error?.message || null,
	};
}
