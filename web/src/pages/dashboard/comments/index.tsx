import { MessageSquare, MessageCircle } from 'lucide-react';

import { DashboardHeaderTitle } from '@/components/page-title/dashboard-header-title';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Gravatar } from '@/components/ui/gravatar';
import { Spinner } from '@/components/ui/spinner';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useArtalkComments } from '@/hooks/use-artalk-comments';
import { useTitle } from '@/hooks/use-page-meta';

export function CommentsPage() {
	const { comments, loading } = useArtalkComments();

	useTitle('评论数据');

	const formatDate = (dateValue: string | Date) => {
		const date = new Date(dateValue);
		if (isNaN(date.getTime())) return String(dateValue);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle
					subtitle="查看来自 Artalk 评论系统的所有访客评论"
					title="评论数据"
				/>

				<Card>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-center">
									<Spinner className="mx-auto" size={32} />
								</div>
							</div>
						) : comments.length === 0 ? (
							<div
								className="flex flex-col items-center justify-center py-8
									text-center"
							>
								<MessageSquare
									className="h-12 w-12 text-muted-foreground/40 mb-4"
								/>
								<p className="text-muted-foreground mb-2">暂无评论</p>
								<p className="text-xs text-muted-foreground/60">
									当有访客在文章下留言后，评论会显示在这里
								</p>
							</div>
						) : (
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>评论者</TableHead>
											<TableHead>评论内容</TableHead>
											<TableHead>所在页面</TableHead>
											<TableHead>状态</TableHead>
											<TableHead>时间</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{comments.map((comment) => (
											<TableRow key={comment.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Gravatar
															hash={comment.emailEncrypted}
															nick={comment.nick}
															size={36}
														/>
														<div className="flex flex-col min-w-0">
															<span className="font-medium text-sm truncate">
																{comment.nick}
															</span>
															{comment.link && (
																<a
																	className="text-xs text-muted-foreground
																		truncate hover:underline"
																	href={comment.link}
																	rel="noopener noreferrer"
																	target="_blank"
																>
																	{comment.link.replace(/^https?:\/\//, '')}
																</a>
															)}
														</div>
													</div>
												</TableCell>
												<TableCell>
													<p className="text-sm line-clamp-2 max-w-md">
														{comment.content}
													</p>
												</TableCell>
												<TableCell>
													<a
														className="text-sm text-muted-foreground truncate
															block hover:text-foreground hover:underline"
														href={`${comment.pageUrl}#atk-comment-${comment.id}`}
														rel="noopener noreferrer"
														target="_blank"
													>
														{comment.pageKey}
													</a>
												</TableCell>
												<TableCell>
													<div className="flex gap-1 flex-wrap">
														{comment.isPinned && (
															<Badge className="text-xs" variant="secondary">
																置顶
															</Badge>
														)}
														{comment.isVerified ? (
															<Badge className="text-xs" variant="default">
																已验证
															</Badge>
														) : (
															<Badge className="text-xs" variant="outline">
																待验证
															</Badge>
														)}
														{comment.isPending && (
															<Badge className="text-xs" variant="secondary">
																待审
															</Badge>
														)}
													</div>
												</TableCell>
												<TableCell
													className="text-xs text-muted-foreground
														whitespace-nowrap"
												>
													{formatDate(comment.date)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
						<div
							className="flex items-center mt-4 justify-end gap-6 text-sm
								text-muted-foreground"
						>
							<div className="flex items-center gap-2">
								<MessageCircle className="h-4 w-4" />
								<span>
									共{' '}
									<strong className="text-foreground">{comments.length}</strong>{' '}
									条评论
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
