import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { SlideForm } from '@/components/slide-form';

export function CreateSlidePage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<DashboardHeaderTitle subtitle="添加一张新的相册图片" title="添加图片" />

			<SlideForm mode="create" />
		</div>
	);
}
