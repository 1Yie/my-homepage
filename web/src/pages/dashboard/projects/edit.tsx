import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '@/api/client';
import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { ProjectForm } from '@/components/project-form';
import { Spinner } from '@/components/ui/spinner';
import { useTitle } from '@/hooks/use-page-meta';

export function EditProjectPage() {
	const { id } = useParams<{ id: string }>();
	const [fetchLoading, setFetchLoading] = useState(true);
	const [initialFormData, setInitialFormData] = useState<{
		name: string;
		description: string;
		tags: string[];
		imageUrl: string;
		githubUrl: string;
		liveUrl: string;
		order: number;
	} | null>(null);
	useTitle(`编辑项目 ${initialFormData?.name}`);

	useEffect(() => {
		const fetchProject = async () => {
			if (!id) return;

			try {
				setFetchLoading(true);
				const response = await client.api.v1.projects({ id }).get();
				const apiResponse = response.data as unknown;
				const typedResponse = apiResponse as {
					success: boolean;
					data: {
						name: string;
						description: string;
						tags: string[];
						imageUrl: string | null;
						githubUrl: string | null;
						liveUrl: string | null;
						order: number;
					};
				};
				if (typedResponse.success && typedResponse.data) {
					const projectData = typedResponse.data;
					setInitialFormData({
						name: projectData.name,
						description: projectData.description,
						tags: projectData.tags,
						imageUrl: projectData.imageUrl || '',
						githubUrl: projectData.githubUrl || '',
						liveUrl: projectData.liveUrl || '',
						order: projectData.order,
					});
				}
			} catch (error) {
				console.error('Failed to fetch project:', error);
			} finally {
				setFetchLoading(false);
			}
		};

		fetchProject();
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

	if (!initialFormData) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">项目不存在</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="修改项目信息" title="编辑项目" />

			<ProjectForm initialData={initialFormData} mode="edit" projectId={id} />
		</div>
	);
}
