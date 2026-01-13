import { ArticleForm } from '@/components/article-form';
import { DashboardHeaderTitle } from '@/components/dashboard-header-title';

export function CreateArticlePage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle
				subtitle="填写文章信息，创建一篇新文章"
				title="创建文章"
			/>

			<ArticleForm mode="create" />
		</div>
	);
}
