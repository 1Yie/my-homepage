import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { TagForm } from '@/components/tag-form';
import { useTitle } from '@/hooks/use-page-title';

export function CreateTagPage() {
	useTitle('新建标签');

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="添加新的文章标签" title="创建标签" />

			<TagForm mode="create" />
		</div>
	);
}
