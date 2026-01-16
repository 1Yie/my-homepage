import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateTag } from '@/hooks/tags/use-create-tag';
import { useUpdateTag } from '@/hooks/tags/use-update-tag';

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
	const [error, setError] = useState<string | null>(null);

	const {
		createTag,
		loading: createLoading,
		error: createError,
	} = useCreateTag();
	const {
		updateTag,
		loading: updateLoading,
		error: updateError,
	} = useUpdateTag();

	const loading = createLoading || updateLoading;
	const apiError = createError || updateError;

	const [formData, setFormData] = useState<TagFormData>({
		name: initialData?.name || '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (mode === 'create') {
			createTag(formData, {
				onSuccess: () => navigate('/dashboard/tags'),
				onError: (error) => setError(error.message || 'Failed to create tag'),
			});
		} else if (tagId) {
			updateTag(
				{ id: tagId, data: formData },
				{
					onSuccess: () => navigate('/dashboard/tags'),
					onError: (error) => setError(error.message || 'Failed to update tag'),
				}
			);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardContent className="space-y-6 pt-6">
					{(error || apiError) && (
						<div
							className="p-3 text-sm text-destructive bg-destructive/10
								rounded-md"
						>
							{error || apiError}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="name">标签名称</Label>
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
