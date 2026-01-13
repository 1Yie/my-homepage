import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TagFormData {
	name: string;
}

interface TagFormProps {
	mode: 'create' | 'edit';
	tagId?: string;
	initialData?: Partial<TagFormData>;
}

export function TagForm({ mode, tagId, initialData }: TagFormProps) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState<TagFormData>({
		name: initialData?.name || '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (mode === 'create') {
				const response = await client.tags.post(formData);
				if (response.data && !response.data.success) {
					setError(response.data.error || 'Failed to create tag');
					setLoading(false);
					return;
				}
			} else if (tagId) {
				const response = await client.tags({ id: tagId }).put(formData);
				if (response.data && !response.data.success) {
					setError(response.data.error || 'Failed to update tag');
					setLoading(false);
					return;
				}
			}

			navigate('/dashboard/tags');
		} catch (error) {
			console.error('Failed to save tag:', error);
			setError('操作失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardContent className="space-y-6 pt-6">
					{error && (
						<div
							className="p-3 text-sm text-destructive bg-destructive/10
								rounded-md"
						>
							{error}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="name">标签名称*</Label>
						<Input
							id="name"
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="输入标签名称，如：前端开发"
							required
							value={formData.name}
						/>
						<p className="text-xs text-muted-foreground">
							标签名称必须唯一，不能与已有标签重复
						</p>
					</div>

					<div className="flex items-center gap-4">
						<Button disabled={loading} type="submit">
							{loading ? '保存中...' : mode === 'create' ? '创建' : '保存'}
						</Button>
						<Button
							onClick={() => navigate('/dashboard/tags')}
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
