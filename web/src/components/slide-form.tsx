import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SlideFormData {
	title: string;
	src: string;
	button: string;
	link: string;
	newTab: boolean;
	order: number;
}

interface SlideFormProps {
	mode: 'create' | 'edit';
	slideId?: string;
	initialData?: Partial<SlideFormData>;
}

export function SlideForm({ mode, slideId, initialData }: SlideFormProps) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState<SlideFormData>({
		title: initialData?.title || '',
		src: initialData?.src || '',
		button: initialData?.button || '',
		link: initialData?.link || '',
		newTab: initialData?.newTab ?? false,
		order: initialData?.order ?? 0,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (mode === 'create') {
				await client.api.v1.slides.post({
					...formData,
					button: formData.button || undefined,
					link: formData.link || undefined,
				});
			} else if (slideId) {
				await client.api.v1.slides({ id: slideId }).put({
					...formData,
					button: formData.button || undefined,
					link: formData.link || undefined,
				});
			}

			navigate('/dashboard/slides');
		} catch (error) {
			console.error('Failed to save slide:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardContent className="space-y-6 pt-6">
					<div className="space-y-2">
						<Label htmlFor="title">标题</Label>
						<Input
							id="title"
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							placeholder="输入图片标题"
							required
							value={formData.title}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="src">图片 URL</Label>
						<Input
							id="src"
							onChange={(e) =>
								setFormData({ ...formData, src: e.target.value })
							}
							placeholder="https://..."
							required
							type="url"
							value={formData.src}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="button">按钮文字</Label>
						<Input
							id="button"
							onChange={(e) =>
								setFormData({ ...formData, button: e.target.value })
							}
							placeholder="例如：了解更多"
							value={formData.button}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="link">跳转链接</Label>
						<Input
							id="link"
							onChange={(e) =>
								setFormData({ ...formData, link: e.target.value })
							}
							placeholder="https://..."
							type="url"
							value={formData.link}
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							checked={formData.newTab}
							id="newTab"
							onCheckedChange={(checked) =>
								setFormData({ ...formData, newTab: checked as boolean })
							}
						/>
						<Label
							className="text-sm font-normal cursor-pointer"
							htmlFor="newTab"
						>
							在新标签页打开链接
						</Label>
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
							onClick={() => navigate('/dashboard/slides')}
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
