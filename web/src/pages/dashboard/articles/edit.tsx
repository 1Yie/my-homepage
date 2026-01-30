import { useParams } from 'react-router-dom';

import { ArticleForm } from '@/components/article/article-form';
import { DashboardHeaderTitle } from '@/components/page-title/dashboard-header-title';
import { Spinner } from '@/components/ui/spinner';
import { useGetArticle } from '@/hooks/article/use-get-article';
import { useTitle } from '@/hooks/use-page-meta';

export function EditArticlePage() {
	const { id } = useParams<{ id: string }>();
	const { article, loading, error } = useGetArticle(id);

	useTitle(`编辑文章 ${article?.title}`);

	const initialFormData = article
		? {
				title: article.title,
				slug: article.slug,
				content: article.content,
				isDraft: article.isDraft,
				tagIds: article.tags.map((tag) => tag.id),
				headerImage: article.headerImage || '',
			}
		: null;

	if (loading) {
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

	if (error) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-red-500">Error: {error}</p>
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
