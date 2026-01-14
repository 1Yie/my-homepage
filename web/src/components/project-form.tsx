import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProjectFormData {
	name: string;
	description: string;
	tags: string[];
	imageUrl: string;
	githubUrl: string;
	liveUrl: string;
	order: number;
}

interface ProjectFormProps {
	mode: 'create' | 'edit';
	projectId?: string;
	initialData?: Partial<ProjectFormData>;
}

export function ProjectForm({
	mode,
	projectId,
	initialData,
}: ProjectFormProps) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [newTag, setNewTag] = useState('');

	const [formData, setFormData] = useState<ProjectFormData>({
		name: initialData?.name || '',
		description: initialData?.description || '',
		tags: initialData?.tags || [],
		imageUrl: initialData?.imageUrl || '',
		githubUrl: initialData?.githubUrl || '',
		liveUrl: initialData?.liveUrl || '',
		order: initialData?.order ?? 0,
	});

	const handleAddTag = () => {
		if (!newTag.trim()) return;
		if (formData.tags.includes(newTag.trim())) {
			setNewTag('');
			return;
		}
		setFormData({
			...formData,
			tags: [...formData.tags, newTag.trim()],
		});
		setNewTag('');
	};

	const handleRemoveTag = (tag: string) => {
		setFormData({
			...formData,
			tags: formData.tags.filter((t) => t !== tag),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (mode === 'create') {
				await client.api.v1.projects.post({
					...formData,
					githubUrl: formData.githubUrl || undefined,
					liveUrl: formData.liveUrl || undefined,
					imageUrl: formData.imageUrl || undefined,
				});
			} else if (projectId) {
				await client.api.v1.projects({ id: projectId }).put({
					...formData,
					githubUrl: formData.githubUrl || undefined,
					liveUrl: formData.liveUrl || undefined,
					imageUrl: formData.imageUrl || undefined,
				});
			}

			navigate('/dashboard/projects');
		} catch (error) {
			console.error('Failed to save project:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardContent className="space-y-6 pt-6">
					<div className="space-y-2">
						<Label htmlFor="name">项目名称</Label>
						<Input
							id="name"
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="输入项目名称"
							required
							value={formData.name}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">项目描述</Label>
						<Textarea
							id="description"
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="输入项目描述"
							required
							rows={3}
							value={formData.description}
						/>
					</div>

					<div className="space-y-2">
						<Label>技术标签</Label>
						<div className="flex gap-2">
							<Input
								onChange={(e) => setNewTag(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleAddTag();
									}
								}}
								placeholder="输入标签名，按回车添加"
								value={newTag}
							/>
							<Button onClick={handleAddTag} type="button">
								添加
							</Button>
						</div>
						{formData.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{formData.tags.map((tag) => (
									<Badge className="flex items-center gap-1" key={tag}>
										{tag}
										<X
											className="h-3 w-3 cursor-pointer"
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveTag(tag);
											}}
										/>
									</Badge>
								))}
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="imageUrl">项目图片 URL</Label>
						<Input
							id="imageUrl"
							onChange={(e) =>
								setFormData({ ...formData, imageUrl: e.target.value })
							}
							placeholder="https://..."
							type="url"
							value={formData.imageUrl}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="githubUrl">GitHub 地址</Label>
						<Input
							id="githubUrl"
							onChange={(e) =>
								setFormData({ ...formData, githubUrl: e.target.value })
							}
							placeholder="https://github.com/..."
							type="url"
							value={formData.githubUrl}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="liveUrl">预览地址</Label>
						<Input
							id="liveUrl"
							onChange={(e) =>
								setFormData({ ...formData, liveUrl: e.target.value })
							}
							placeholder="https://..."
							type="url"
							value={formData.liveUrl}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="order">排序</Label>
						<Input
							id="order"
							onChange={(e) =>
								setFormData({ ...formData, order: Number(e.target.value) })
							}
							placeholder="0"
							type="number"
							value={formData.order}
						/>
						<p className="text-xs text-muted-foreground">数字越小越靠前</p>
					</div>

					<div className="flex items-center gap-4">
						<Button disabled={loading} type="submit">
							{loading ? '保存中...' : mode === 'create' ? '创建' : '保存'}
						</Button>
						<Button
							onClick={() => navigate('/dashboard/projects')}
							type="button"
							variant="outline"
						>
							取消
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
