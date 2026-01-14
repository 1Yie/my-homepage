import { Pin, Plus, Search, Users } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import type { Friend } from '@/hooks/use-get-friends';

import { client } from '@/api/client';
import { DashboardHeaderTitle } from '@/components/dashboard-header-title';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogPopup,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useTitle } from '@/hooks/use-page-title';

export function FriendsPage() {
	const [friends, setFriends] = useState<Friend[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null);
	useTitle('友链管理');
	const fetchFriends = useCallback(async () => {
		try {
			setLoading(true);
			const response = await client.api.v1.friends.get();
			if (response.data?.data) {
				const data = response.data.data;
				const filtered = searchQuery
					? data.filter((friend) => {
							return (
								friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
								friend.description
									.toLowerCase()
									.includes(searchQuery.toLowerCase())
							);
						})
					: data;
				setFriends(filtered);
			}
		} catch (error) {
			console.error('Failed to fetch friends:', error);
		} finally {
			setLoading(false);
		}
	}, [searchQuery]);

	useEffect(() => {
		fetchFriends();
	}, [fetchFriends]);

	const handleDelete = async (friend: Friend) => {
		setFriendToDelete(friend);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!friendToDelete) return;

		try {
			await client.api.v1
				.friends({ id: friendToDelete.id.toString() })
				.delete();
			fetchFriends();
			setDeleteDialogOpen(false);
			setFriendToDelete(null);
		} catch (error) {
			console.error('Failed to delete friend:', error);
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle
					subtitle="管理友情链接，展示您的伙伴"
					title="友链管理"
				/>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="relative">
							<Search
								className="absolute z-50 left-2 top-2 h-4 w-4
									text-muted-foreground"
							/>
							<Input
								className="pl-8 w-64 h-full"
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="搜索友链..."
								value={searchQuery}
							/>
						</div>
					</div>

					<Button
						render={
							<Link to="/dashboard/friends/create">
								<Plus className="mr-2 h-4 w-4" />
								添加友链
							</Link>
						}
					></Button>
				</div>

				<Card>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-center">
									<Spinner className="mx-auto" size={32} />
								</div>
							</div>
						) : friends.length === 0 ? (
							<div
								className="flex flex-col items-center justify-center py-8
									text-center"
							>
								<p className="text-muted-foreground mb-4">暂无友链</p>
								<Button
									render={
										<Link to="/dashboard/friends/create">
											<Plus className="mr-2 h-4 w-4" />
											添加第一个友链
										</Link>
									}
								></Button>
							</div>
						) : (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-16">头像</TableHead>
											<TableHead>名称</TableHead>
											<TableHead>描述</TableHead>
											<TableHead className="w-24">置顶</TableHead>
											<TableHead className="w-24">排序</TableHead>
											<TableHead className="w-32">社交链接</TableHead>
											<TableHead className="w-32">操作</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{friends.map((friend) => (
											<TableRow key={friend.id}>
												<TableCell>
													<img
														alt={friend.name}
														className="h-10 w-10 rounded-full object-cover"
														src={friend.image}
													/>
												</TableCell>
												<TableCell className="font-medium">
													<div className="flex items-center gap-2">
														<Users className="h-4 w-4 text-muted-foreground" />
														{friend.name}
													</div>
												</TableCell>
												<TableCell className="max-w-xs truncate">
													{friend.description}
												</TableCell>
												<TableCell>
													{friend.pinned && (
														<Badge variant="secondary">
															<Pin className="h-3 w-3 mr-1" />
															置顶
														</Badge>
													)}
												</TableCell>
												<TableCell>{friend.order}</TableCell>
												<TableCell>
													<Badge variant="outline">
														{friend.socialLinks.length} 个
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															render={
																<Link
																	to={`/dashboard/friends/edit/${friend.id}`}
																>
																	编辑
																</Link>
															}
															size="sm"
															variant="outline"
														/>
														<Button
															onClick={() => handleDelete(friend)}
															size="sm"
															variant="destructive"
														>
															删除
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>

				<AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
					<AlertDialogPopup>
						<AlertDialogHeader>
							<AlertDialogTitle>删除友链</AlertDialogTitle>
							<AlertDialogDescription>
								您确定要删除友链 "{friendToDelete?.name}"
								吗？此操作无法撤销，相关的社交链接也会被删除。
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogClose>
								<Button variant="outline">取消</Button>
							</AlertDialogClose>
							<Button onClick={confirmDelete} variant="destructive">
								删除
							</Button>
						</AlertDialogFooter>
					</AlertDialogPopup>
				</AlertDialog>
			</div>
		</div>
	);
}
