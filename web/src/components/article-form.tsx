import { useQueryClient } from '@tanstack/react-query';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '@/api/client';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useGetTags } from '@/hooks/use-get-tags';
import { generateSlug } from '@/lib/generate-slug';

interface ArticleFormData {
	title: string;
	slug: string;
	content: string;
	isDraft: boolean;
	tagIds: number[];
	tagNames: string[]; // Store new tag names that don't exist yet
	headerImage: string;
}

interface ArticleFormProps {
	mode: 'create' | 'edit';
	articleId?: string;
	initialData?: Partial<ArticleFormData>;
}

export function ArticleForm({
	mode,
	articleId,
	initialData,
}: ArticleFormProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { tags: availableTags } = useGetTags();
	const [loading, setLoading] = useState(false);
	const [newTagName, setNewTagName] = useState('');

	const handleAddTag = async () => {
		if (!newTagName.trim()) return;

		// Check if tag already exists
		const existingTag = availableTags.find(
			(tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
		);

		if (existingTag) {
			// If tag exists, just add it to selected tags
			if (!formData.tagIds.includes(existingTag.id)) {
				setFormData({
					...formData,
					tagIds: [...formData.tagIds, existingTag.id],
				});
			}
		} else {
			// Add to new tag names (will be created when saving the article)
			if (!formData.tagNames.includes(newTagName.trim())) {
				setFormData({
					...formData,
					tagNames: [...formData.tagNames, newTagName.trim()],
				});
			}
		}

		setNewTagName('');
	};

	const handleRemoveTag = (tagId: number) => {
		setFormData({
			...formData,
			tagIds: formData.tagIds.filter((id) => id !== tagId),
		});
	};

	const handleRemoveNewTag = (tagName: string) => {
		setFormData({
			...formData,
			tagNames: formData.tagNames.filter((name) => name !== tagName),
		});
	};

	// Form states
	const [formData, setFormData] = useState<ArticleFormData>({
		title: initialData?.title || '',
		slug: initialData?.slug || '',
		content: initialData?.content || '',
		isDraft: initialData?.isDraft ?? true,
		tagIds: initialData?.tagIds || [],
		tagNames: [], // New tags to be created
		headerImage: initialData?.headerImage || '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setLoading(true);

			// First, create any new tags
			const newTagIds: number[] = [];
			for (const tagName of formData.tagNames) {
				const response = await client.tags.post({
					name: tagName,
				});
				if (response.data) {
					newTagIds.push(response.data.data.id);
				}
			}

			// Combine existing tag IDs with newly created tag IDs
			const allTagIds = [...formData.tagIds, ...newTagIds];

			if (mode === 'create') {
				await client.articles.post({
					title: formData.title,
					slug: formData.slug,
					content: formData.content,
					isDraft: formData.isDraft,
					tagIds: allTagIds,
					headerImage: formData.headerImage,
				});
			} else if (mode === 'edit' && articleId) {
				await client.articles({ id: articleId }).put({
					title: formData.title,
					slug: formData.slug,
					content: formData.content,
					isDraft: formData.isDraft,
					tagIds: allTagIds,
					headerImage: formData.headerImage,
				});
			}

			// Invalidate tags query to refresh the list
			queryClient.invalidateQueries({ queryKey: ['tags'] });

			navigate('/dashboard/articles');
		} catch (error) {
			console.error(`Failed to ${mode} article:`, error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="max-w-7xl">
			<CardContent>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="grid gap-2">
						<Label htmlFor="title">标题</Label>
						<Input
							id="title"
							onChange={(e) => {
								const newTitle = e.target.value;
								setFormData({
									...formData,
									title: newTitle,
									slug: generateSlug(newTitle),
								});
							}}
							placeholder="输入文章标题"
							required
							value={formData.title}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="slug">Slug</Label>
						<Input
							id="slug"
							onChange={(e) =>
								setFormData({ ...formData, slug: e.target.value })
							}
							placeholder="自动生成的 slug"
							required
							value={formData.slug}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="headerImage">头图链接</Label>
						<Input
							id="headerImage"
							onChange={(e) =>
								setFormData({ ...formData, headerImage: e.target.value })
							}
							placeholder="输入头图图片链接 (可选)"
							value={formData.headerImage}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="status">状态</Label>
						<Select
							onValueChange={(value) =>
								setFormData({ ...formData, isDraft: value === '草稿' })
							}
							value={formData.isDraft ? '草稿' : '已发布'}
						>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="草稿">草稿</SelectItem>
								<SelectItem value="已发布">已发布</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label>标签</Label>
						<div className="space-y-3">
							{/* Add new tag input */}
							<div className="flex gap-2">
								<Input
									onChange={(e) => setNewTagName(e.target.value)}
									placeholder="输入标签名称"
									value={newTagName}
								/>
								<Button
									disabled={!newTagName.trim()}
									onClick={handleAddTag}
									size="sm"
									type="button"
								>
									添加
								</Button>
							</div>

							{/* Selected tags display */}
							{formData.tagIds.length > 0 || formData.tagNames.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{/* Existing tags */}
									{formData.tagIds.map((tagId) => {
										const tag = availableTags.find((t) => t.id === tagId);
										return tag ? (
											<div
												className="inline-flex items-center gap-1 px-2 py-1
													bg-secondary text-secondary-foreground rounded-md
													text-sm"
												key={`existing-${tag.id}`}
											>
												{tag.name}
												<button
													className="ml-1 text-secondary-foreground/70
														hover:text-secondary-foreground"
													onClick={() => handleRemoveTag(tag.id)}
													type="button"
												>
													×
												</button>
											</div>
										) : null;
									})}
									{/* New tags (not yet created) */}
									{formData.tagNames.map((tagName) => (
										<div
											className="inline-flex items-center gap-1 px-2 py-1
												bg-blue-100 text-blue-800 rounded-md text-sm border
												border-blue-300 dark:bg-blue-900 dark:text-blue-100
												dark:border-blue-700"
											key={`new-${tagName}`}
										>
											{tagName}

											<button
												className="ml-1 text-blue-800/70 hover:text-blue-800
													dark:text-blue-100/70 dark:hover:text-blue-100"
												onClick={() => handleRemoveNewTag(tagName)}
												type="button"
											>
												×
											</button>
										</div>
									))}
								</div>
							) : (
								<div className="text-sm text-muted-foreground">
									暂无标签，请在上方输入并添加
								</div>
							)}
						</div>
					</div>

					{/* Content Editor and Preview */}
					<div className="grid gap-2">
						<Label htmlFor="content">内容</Label>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{/* Editor */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-muted-foreground">
									Markdown 编辑器
								</Label>
								<MDEditor
									height="auto"
									minHeight={300}
									onChange={(value) =>
										setFormData({ ...formData, content: value || '' })
									}
									preview="edit"
									value={formData.content}
								/>
							</div>

							{/* Preview */}
							<div className="space-y-2">
								<Label className="text-sm font-medium text-muted-foreground">
									实时预览
								</Label>
								<div
									className="border rounded-md py-1 px-2 bg-muted/20
										overflow-y-auto h-auto"
								>
									<MarkdownRenderer>{formData.content}</MarkdownRenderer>
								</div>
							</div>
						</div>
					</div>

					<div className="flex gap-4">
						<Button disabled={loading} type="submit">
							{loading
								? mode === 'create'
									? '创建中...'
									: '保存中...'
								: mode === 'create'
									? '创建文章'
									: '保存更改'}
						</Button>
						<Button
							onClick={() => navigate('/dashboard/articles')}
							type="button"
							variant="outline"
						>
							取消
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
