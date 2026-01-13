import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { SlideForm } from '@/components/slide-form';
import { useTitle } from '@/hooks/use-page-title';

export function CreateSlidePage() {
	useTitle('新建图片');

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="添加一张新的相册图片" title="添加图片" />

			<SlideForm mode="create" />
		</div>
	);
}
