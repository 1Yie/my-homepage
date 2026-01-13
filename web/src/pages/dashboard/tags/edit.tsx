import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '@/api/client';
import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { TagForm } from '@/components/tag-form';

export function EditTagPage() {
	const { id } = useParams<{ id: string }>();
	const [fetchLoading, setFetchLoading] = useState(true);
	const [initialFormData, setInitialFormData] = useState<{
		name: string;
	} | null>(null);

	useEffect(() => {
		const fetchTag = async () => {
			if (!id) return;

			try {
				setFetchLoading(true);
				const response = await client.tags({ id }).get();
				const apiResponse = response.data as unknown;
				const typedResponse = apiResponse as {
					success: boolean;
					data: {
						name: string;
					};
				};
				if (typedResponse.success && typedResponse.data) {
					const tagData = typedResponse.data;
					setInitialFormData({
						name: tagData.name,
					});
				}
			} catch (error) {
				console.error('Failed to fetch tag:', error);
			} finally {
				setFetchLoading(false);
			}
		};

		fetchTag();
	}, [id]);

	if (fetchLoading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">加载中...</p>
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
