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
import { useTitle } from '@/hooks/use-page-meta';

interface ProjectListItem {
	id: number;
	name: string;
	description: string;
	tags: string[];
	imageUrl?: string | null;
	githubUrl?: string | null;
	liveUrl?: string | null;
	order: number;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export function ProjectsPage() {
	const [projects, setProjects] = useState<ProjectListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] =
		useState<ProjectListItem | null>(null);

	useTitle('项目管理');

	const fetchProjects = useCallback(async () => {
		try {
			setLoading(true);
			const response = await client.api.v1.projects.get();
			if (response.data) {
				const data = response.data.data;
				if (Array.isArray(data)) {
					const filtered = searchQuery
						? (data as unknown[]).filter((p: unknown) => {
								const project = p as ProjectListItem;
								return (
									project.name
										.toLowerCase()
										.includes(searchQuery.toLowerCase()) ||
									project.description
										.toLowerCase()
										.includes(searchQuery.toLowerCase())
								);
							})
						: data;
					setProjects(filtered as ProjectListItem[]);
				}
			}
		} catch (error) {
			console.error('Failed to fetch projects:', error);
		} finally {
			setLoading(false);
		}
	}, [searchQuery]);

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	const handleDelete = async (project: ProjectListItem) => {
		setProjectToDelete(project);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!projectToDelete) return;

		try {
			await client.api.v1
				.projects({ id: projectToDelete.id.toString() })
				.delete();
			fetchProjects();
			setDeleteDialogOpen(false);
			setProjectToDelete(null);
		} catch (error) {
			console.error('Failed to delete project:', error);
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle
					subtitle="管理您的所有项目展示"
					title="项目管理"
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
								placeholder="搜索项目..."
								value={searchQuery}
							/>
						</div>
					</div>

					<Button
						render={
							<Link to="/dashboard/projects/create">
								<Plus className="mr-2 h-4 w-4" />
								创建项目
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
						) : projects.length === 0 ? (
							<div
								className="flex flex-col items-center justify-center py-8
									text-center"
							>
								<p className="text-muted-foreground mb-4">暂无项目</p>
								<Button
									render={
										<Link to="/dashboard/projects/create">
											<Plus className="mr-2 h-4 w-4" />
											创建第一个项目
										</Link>
									}
								></Button>
							</div>
						) : (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>名称</TableHead>
											<TableHead>描述</TableHead>
											<TableHead>标签</TableHead>
											<TableHead className="w-24">排序</TableHead>
											<TableHead>链接</TableHead>
											<TableHead className="w-32">操作</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{projects.map((project) => (
											<TableRow key={project.id}>
												<TableCell className="font-medium">
													{project.name}
												</TableCell>
												<TableCell className="max-w-xs truncate">
													{project.description}
												</TableCell>
												<TableCell>
													<div className="flex flex-wrap gap-1">
														{project.tags.slice(0, 2).map((tag, idx) => (
															<Badge
																className="text-xs"
																key={idx}
																variant="outline"
															>
																{tag}
															</Badge>
														))}
														{project.tags.length > 2 && (
															<Badge className="text-xs" variant="outline">
																+{project.tags.length - 2}
															</Badge>
														)}
													</div>
												</TableCell>
												<TableCell>{project.order}</TableCell>
												<TableCell>
													<div className="flex flex-col gap-1 text-xs">
														{project.githubUrl && (
															<span className="text-muted-foreground">
																GitHub
															</span>
														)}
														{project.liveUrl && (
															<span className="text-muted-foreground">
																预览
															</span>
														)}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															render={
																<Link
																	to={`/dashboard/projects/edit/${project.id}`}
																>
																	编辑
																</Link>
															}
															size="sm"
															variant="outline"
														/>
														<Button
															onClick={() => handleDelete(project)}
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
							<AlertDialogTitle>删除项目</AlertDialogTitle>
							<AlertDialogDescription>
								您确定要删除项目 "{projectToDelete?.name}" 吗？此操作无法撤销。
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
