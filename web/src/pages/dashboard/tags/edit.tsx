import { useParams } from 'react-router-dom';

import { DashboardHeaderTitle } from '@/components/page-title/dashboard-header-title';
import { TagForm } from '@/components/tag-form';
import { Spinner } from '@/components/ui/spinner';
import { useGetTag } from '@/hooks/tags/use-get-tag';
import { useTitle } from '@/hooks/use-page-meta';

import { DashboardNotFoundPage } from '../not-found';

export function EditTagPage() {
	const { id } = useParams<{ id: string }>();
	const { tag, loading, error, isNotFound } = useGetTag(id);

	useTitle(`编辑标签 ${tag?.name || ''}`);

	const initialFormData = tag
		? {
				name: tag.name,
			}
		: null;

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="text-center">
					<Spinner className="mx-auto" size={32} />
				</div>
			</div>
		);
	}

	if (error) {
		if (isNotFound) return <DashboardNotFoundPage />;
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-red-500">Error: {error}</p>
				</div>
			</div>
		);
	}

	if (!initialFormData) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">标签不存在</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="修改标签信息" title="编辑标签" />

			<TagForm initialData={initialFormData} mode="edit" tagId={id} />
		</div>
	);
}
