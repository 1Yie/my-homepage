import { Plus, Search, Tag as TagIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

interface TagListItem {
	id: number;
	name: string;
	articleCount: number;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export function TagsPage() {
	const [tags, setTags] = useState<TagListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [tagToDelete, setTagToDelete] = useState<TagListItem | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	useTitle('标签管理');

	const fetchTags = useCallback(async () => {
		try {
			setLoading(true);
			const response = await client.api.v1.tags.get();
			if (response.data) {
				const data = response.data.data;
				if (Array.isArray(data)) {
					const filtered = searchQuery
						? (data as unknown[]).filter((t: unknown) => {
								const tag = t as TagListItem;
								return tag.name
									.toLowerCase()
									.includes(searchQuery.toLowerCase());
							})
						: data;
					setTags(filtered as TagListItem[]);
				}
			}
		} catch (error) {
			console.error('Failed to fetch tags:', error);
		} finally {
			setLoading(false);
		}
	}, [searchQuery]);

	useEffect(() => {
		fetchTags();
	}, [fetchTags]);

	const handleDelete = async (tag: TagListItem) => {
		setTagToDelete(tag);
		setDeleteError(null);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!tagToDelete) return;

		try {
			const response = await client.api.v1
				.tags({ id: tagToDelete.id.toString() })
				.delete();
			if (response.data && !response.data.success) {
				setDeleteError(response.data.error || 'Failed to delete tag');
				return;
			}
			fetchTags();
			setDeleteDialogOpen(false);
			setTagToDelete(null);
			setDeleteError(null);
		} catch (error) {
			console.error('Failed to delete tag:', error);
			setDeleteError('Failed to delete tag');
		}
	};

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle
					subtitle="管理文章标签，整理内容分类"
					title="标签管理"
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
								placeholder="搜索标签..."
								value={searchQuery}
							/>
						</div>
					</div>

					<Button
						render={
							<Link to="/dashboard/tags/create">
								<Plus className="mr-2 h-4 w-4" />
								创建标签
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
						) : tags.length === 0 ? (
							<div
								className="flex flex-col items-center justify-center py-8
									text-center"
							>
								<p className="text-muted-foreground mb-4">暂无标签</p>
								<Button
									render={
										<Link to="/dashboard/tags/create">
											<Plus className="mr-2 h-4 w-4" />
											创建第一个标签
										</Link>
									}
								></Button>
							</div>
						) : (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>标签名称</TableHead>
											<TableHead className="w-32">文章数量</TableHead>
											<TableHead className="w-40">创建时间</TableHead>
											<TableHead className="w-32">操作</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tags.map((tag) => (
											<TableRow key={tag.id}>
												<TableCell className="font-medium">
													<div className="flex items-center gap-2">
														<TagIcon className="h-4 w-4 text-muted-foreground" />
														{tag.name}
													</div>
												</TableCell>
												<TableCell>
													<Badge variant="secondary">{tag.articleCount}</Badge>
												</TableCell>
												<TableCell className="text-muted-foreground text-sm">
													{formatDate(tag.createdAt)}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															render={
																<Link to={`/dashboard/tags/edit/${tag.id}`}>
																	编辑
																</Link>
															}
															size="sm"
															variant="outline"
														/>
														<Button
															disabled={tag.articleCount > 0}
															onClick={() => handleDelete(tag)}
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
							<AlertDialogTitle>删除标签</AlertDialogTitle>
							<AlertDialogDescription>
								{deleteError ? (
									<div className="text-destructive">{deleteError}</div>
								) : tagToDelete?.articleCount ? (
									<div>
										无法删除标签 "{tagToDelete.name}"，因为有{' '}
										{tagToDelete.articleCount} 篇文章正在使用该标签。
										<br />
										请先取消这些文章与该标签的关联，然后再删除。
									</div>
								) : (
									<div>
										您确定要删除标签 "{tagToDelete?.name}" 吗？此操作无法撤销。
									</div>
								)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogClose>
								<Button variant="outline">
									{deleteError || tagToDelete?.articleCount ? '关闭' : '取消'}
								</Button>
							</AlertDialogClose>
							{!deleteError && !tagToDelete?.articleCount && (
								<Button onClick={confirmDelete} variant="destructive">
									删除
								</Button>
							)}
						</AlertDialogFooter>
					</AlertDialogPopup>
				</AlertDialog>
			</div>
		</div>
	);
}
