import { useParams } from 'react-router-dom';

import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { FriendForm } from '@/components/friend-form';
import { Spinner } from '@/components/ui/spinner';
import { useGetFriend } from '@/hooks/friends/use-get-friend';
import { useTitle } from '@/hooks/use-page-meta';

export function EditFriendPage() {
	const { id } = useParams<{ id: string }>();
	const { friend, loading: fetchLoading, error } = useGetFriend(id);

	const initialFormData = friend
		? {
				name: friend.name,
				image: friend.image,
				description: friend.description,
				pinned: friend.pinned,
				order: friend.order,
				socialLinks: friend.socialLinks.map((link) => ({
					name: link.name,
					link: link.link,
					iconLight: link.iconLight,
					iconDark: link.iconDark,
				})),
			}
		: null;

	useTitle(`编辑友链 ${friend?.name || ''}`);

	if (fetchLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="text-center">
					<Spinner className="mx-auto" size={32} />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">加载友链失败: {error}</p>
			</div>
		);
	}

	if (!initialFormData) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">未找到友链</p>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle subtitle="编辑友链信息" title="编辑友链" />

				<FriendForm friendId={id} initialData={initialFormData} mode="edit" />
			</div>
		</div>
	);
}
