import { useParams } from 'react-router-dom';

import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { ProjectForm } from '@/components/project-form';
import { Spinner } from '@/components/ui/spinner';
import { useGetProject } from '@/hooks/projects/use-get-project';
import { useTitle } from '@/hooks/use-page-meta';

export function EditProjectPage() {
	const { id } = useParams<{ id: string }>();
	const { project, loading: fetchLoading, error } = useGetProject(id);

	useTitle(`编辑项目 ${project?.name || ''}`);

	const initialFormData = project
		? {
				name: project.name,
				description: project.description,
				tags: project.tags,
				imageUrl: project.imageUrl || '',
				githubUrl: project.githubUrl || '',
				liveUrl: project.liveUrl || '',
				order: project.order,
			}
		: null;

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

	if (error) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-8">
					<p className="text-muted-foreground">加载项目失败: {error}</p>
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
