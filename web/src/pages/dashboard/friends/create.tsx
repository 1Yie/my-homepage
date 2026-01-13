import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { FriendForm } from '@/components/friend-form';
import { useTitle } from '@/hooks/use-page-title';

export function CreateFriendPage() {
	useTitle('新建友链');
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle subtitle="添加新的友情链接" title="添加友链" />

				<FriendForm mode="create" />
			</div>
		</div>
	);
}
