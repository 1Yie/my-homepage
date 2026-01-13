import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { ProjectForm } from '@/components/project-form';

export function CreateProjectPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle
				subtitle="填写项目信息，创建一个新项目"
				title="创建项目"
			/>

			<ProjectForm mode="create" />
		</div>
	);
}
