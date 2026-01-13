import { Plus, Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
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

interface Article {
	id: number;
	title: string;
	slug: string;
	content: string;
	isDraft: boolean;
	createdAt: string | Date;
	updatedAt: string | Date;
	authorId: string;
	tags: Array<{
		id: number;
		name: string;
	}>;
	author?: {
		id: string;
		name: string;
	};
}

export function ArticlesPage() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
	useTitle('文章管理');
	const fetchArticles = useCallback(async () => {
		try {
			setLoading(true);
			const response = await client.articles.get({
				query: searchQuery ? { q: searchQuery } : undefined,
			});
			if (response.data) {
				// Handle both paginated and non-paginated responses
				const data = response.data.data;
				if (data && typeof data === 'object' && 'articles' in data) {
					// Paginated response
					setArticles(data.articles);
				} else if (Array.isArray(data)) {
					// Direct array response
					setArticles(data);
				}
			}
		} catch (error) {
			console.error('Failed to fetch articles:', error);
		} finally {
			setLoading(false);
		}
	}, [searchQuery]);

	useEffect(() => {
		fetchArticles();
	}, [fetchArticles]);

	const handleDelete = async (article: Article) => {
		setArticleToDelete(article);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!articleToDelete) return;

		try {
			await client.articles({ id: articleToDelete.id.toString() }).delete();
			fetchArticles();
			setDeleteDialogOpen(false);
			setArticleToDelete(null);
		} catch (error) {
			console.error('Failed to delete article:', error);
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle
					subtitle="管理您的所有文章，包括草稿和已发布的文章"
					title="文章管理"
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
								placeholder="搜索文章..."
								value={searchQuery}
							/>
						</div>
					</div>

					<Button
						render={
							<Link to="/dashboard/articles/create">
								<Plus className="mr-2 h-4 w-4" />
								创建文章
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
						) : articles.length === 0 ? (
							<div
								className="flex flex-col items-center justify-center py-8
									text-center"
							>
								<p className="text-muted-foreground mb-4">暂无文章</p>
								<Button
									render={
										<Link to="/dashboard/articles/create">
											<Plus className="mr-2 h-4 w-4" />
											创建第一篇文章
										</Link>
									}
								></Button>
							</div>
						) : (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>标题</TableHead>
											<TableHead>Slug</TableHead>
											<TableHead className="w-24">状态</TableHead>
											<TableHead>标签</TableHead>
											<TableHead>创建时间</TableHead>
											<TableHead className="w-32">操作</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{articles.map((article) => (
											<TableRow key={article.id}>
												<TableCell className="font-medium">
													{article.title}
												</TableCell>
												<TableCell
													className="font-mono text-sm text-muted-foreground"
												>
													{article.slug}
												</TableCell>
												<TableCell>
													<Badge
														variant={article.isDraft ? 'secondary' : 'default'}
													>
														{article.isDraft ? '草稿' : '已发布'}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex flex-wrap gap-1">
														{article.tags.slice(0, 2).map((tag) => (
															<Badge
																className="text-xs"
																key={tag.id}
																variant="outline"
															>
																{tag.name}
															</Badge>
														))}
														{article.tags.length > 2 && (
															<Badge className="text-xs" variant="outline">
																+{article.tags.length - 2}
															</Badge>
														)}
													</div>
												</TableCell>
												<TableCell>
													{new Date(article.createdAt).toLocaleDateString()}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															render={
																<Link
																	to={`/dashboard/articles/edit/${article.id}`}
																>
																	编辑
																</Link>
															}
															size="sm"
															variant="outline"
														/>
														<Button
															onClick={() => handleDelete(article)}
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
							<AlertDialogTitle>删除文章</AlertDialogTitle>
							<AlertDialogDescription>
								您确定要删除文章 "{articleToDelete?.slug}" 吗？此操作无法撤销。
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
