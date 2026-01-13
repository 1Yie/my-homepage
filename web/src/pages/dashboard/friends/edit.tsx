import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { Friend } from '@/hooks/use-get-friends';

import { client } from '@/api/client';
import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import { FriendForm } from '@/components/friend-form';
import { Spinner } from '@/components/ui/spinner';
import { useTitle } from '@/hooks/use-page-title';

export function EditFriendPage() {
	const { id } = useParams<{ id: string }>();
	const [friend, setFriend] = useState<Friend | null>(null);
	const [loading, setLoading] = useState(true);
	useTitle(`编辑友链 ${friend?.name}`);
	useEffect(() => {
		const fetchFriend = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await client.friends({ id }).get();
				if (response.data?.data) {
					setFriend(response.data.data);
				}
			} catch (error) {
				console.error('Failed to fetch friend:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchFriend();
	}, [id]);

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="text-center">
					<Spinner className="mx-auto" size={32} />
				</div>
			</div>
		);
	}

	if (!friend) {
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

				<FriendForm
					friendId={id}
					initialData={{
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
					}}
					mode="edit"
				/>
			</div>
		</div>
	);
}
