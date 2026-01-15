import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '@/api/client';
import { ArticleForm } from '@/components/article-form';
import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { Spinner } from '@/components/ui/spinner';
import { useTitle } from '@/hooks/use-page-meta';
interface ApiResponse<T> {
	success: boolean;
	data: T;
}

interface ArticleApiData {
	id: number;
	title: string;
	slug: string;
	content: string;
	isDraft: boolean;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	headerImage: string | null;
	tags: Array<{
		id: number;
		name: string;
	}>;
	author: {
		id: string;
		name: string;
		email: string;
	};
}

interface Article {
	id: number;
	title: string;
	slug: string;
	content: string;
	isDraft: boolean;
	createdAt: string;
	updatedAt: string;
	authorId: string;
	tags: Array<{
		id: number;
		name: string;
	}>;
	author?: {
		id: string;
		name: string;
		email: string;
	};
}

export function EditArticlePage() {
	const { id } = useParams<{ id: string }>();
	const [fetchLoading, setFetchLoading] = useState(true);
	const [article, setArticle] = useState<Article | null>(null);
	const [initialFormData, setInitialFormData] = useState<{
		title: string;
		slug: string;
		content: string;
		isDraft: boolean;
		tagIds: number[];
		headerImage: string;
	} | null>(null);
	useTitle(`编辑文章 ${initialFormData?.title}`);

	useEffect(() => {
		const fetchArticle = async () => {
			if (!id) return;

			try {
				setFetchLoading(true);
				const response = await client.api.v1.articles({ id }).get();
				const apiResponse = response.data as ApiResponse<ArticleApiData>;
				if (apiResponse.success && apiResponse.data) {
					const articleData = apiResponse.data;
					setArticle({
						...articleData,
						createdAt: new Date(articleData.createdAt).toISOString(),
						updatedAt: new Date(articleData.updatedAt).toISOString(),
					});
					setInitialFormData({
						title: articleData.title,
						slug: articleData.slug,
						content: articleData.content,
						isDraft: articleData.isDraft,
						tagIds: articleData.tags.map((tag) => tag.id),
						headerImage: articleData.headerImage || '',
					});
				}
			} catch (error) {
				console.error('Failed to fetch article:', error);
			} finally {
				setFetchLoading(false);
			}
		};

		fetchArticle();
	}, [id]);

	if (fetchLoading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<div className="text-center">
						<Spinner className="mx-auto" size={32} />
					</div>
				</div>
			</div>
		);
	}

	if (!article || !initialFormData) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">文章不存在</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="修改文章信息" title="编辑文章" />

			<ArticleForm articleId={id} initialData={initialFormData} mode="edit" />
		</div>
	);
}
