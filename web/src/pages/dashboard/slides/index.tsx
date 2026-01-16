import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

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
import { useDeleteSlide } from '@/hooks/slides/use-delete-slide';
import { useGetSlides, type Slide } from '@/hooks/slides/use-get-slides';
import { useTitle } from '@/hooks/use-page-meta';

export function SlidesPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);

	const { slides: allSlides, loading } = useGetSlides();
	const { deleteSlide } = useDeleteSlide();

	useTitle('相册管理');

	// Filter slides based on search query
	const slides = useMemo(() => {
		if (!searchQuery) return allSlides;
		return allSlides.filter((slide) =>
			slide.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [allSlides, searchQuery]);

	const handleDelete = (slide: Slide) => {
		setSlideToDelete(slide);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (!slideToDelete) return;

		deleteSlide(slideToDelete.id.toString(), {
			onSuccess: () => {
				setDeleteDialogOpen(false);
				setSlideToDelete(null);
			},
		});
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle
					subtitle="管理首页相册的所有图片"
					title="相册管理"
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
								placeholder="搜索相册..."
								value={searchQuery}
							/>
						</div>
					</div>

					<Button
						render={
							<Link to="/dashboard/slides/create">
								<Plus className="mr-2 h-4 w-4" />
								添加图片
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
						) : slides.length === 0 ? (
							<div
								className="flex flex-col items-center justify-center py-8
									text-center"
							>
								<p className="text-muted-foreground mb-4">暂无图片</p>
								<Button
									render={
										<Link to="/dashboard/slides/create">
											<Plus className="mr-2 h-4 w-4" />
											添加第一张图片
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
											<TableHead>预览</TableHead>
											<TableHead>按钮文字</TableHead>
											<TableHead>链接</TableHead>
											<TableHead className="w-24">新标签</TableHead>
											<TableHead className="w-24">排序</TableHead>
											<TableHead className="w-32">操作</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{slides.map((slide) => (
											<TableRow key={slide.id}>
												<TableCell className="font-medium">
													{slide.title}
												</TableCell>
												<TableCell>
													<img
														alt={slide.title}
														className="h-12 w-20 object-cover rounded"
														src={slide.src}
													/>
												</TableCell>
												<TableCell>
													{slide.button || (
														<span className="text-muted-foreground">-</span>
													)}
												</TableCell>
												<TableCell className="max-w-xs truncate">
													{slide.link ? (
														<a
															className="text-blue-500 hover:underline"
															href={slide.link}
															rel="noopener noreferrer"
															target="_blank"
														>
															{slide.link}
														</a>
													) : (
														<span className="text-muted-foreground">-</span>
													)}
												</TableCell>
												<TableCell>{slide.newTab ? '是' : '否'}</TableCell>
												<TableCell>{slide.order}</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															render={
																<Link to={`/dashboard/slides/edit/${slide.id}`}>
																	编辑
																</Link>
															}
															size="sm"
															variant="outline"
														/>
														<Button
															onClick={() => handleDelete(slide)}
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
							<AlertDialogTitle>删除图片</AlertDialogTitle>
							<AlertDialogDescription>
								您确定要删除图片 "{slideToDelete?.title}" 吗？此操作无法撤销。
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
