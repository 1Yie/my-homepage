import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateFriend } from '@/hooks/friends/use-create-friend';
import { useUpdateFriend } from '@/hooks/friends/use-update-friend';

interface SocialLink {
	name: string;
	link: string;
	iconLight: string;
	iconDark: string;
}

interface FriendFormData {
	name: string;
	image: string;
	description: string;
	pinned: boolean;
	order: number;
	socialLinks: SocialLink[];
}

interface FriendFormProps {
	mode: 'create' | 'edit';
	friendId?: string;
	initialData?: Partial<FriendFormData>;
}

export function FriendForm({ mode, friendId, initialData }: FriendFormProps) {
	const navigate = useNavigate();

	const { createFriend, loading: createLoading } = useCreateFriend();
	const { updateFriend, loading: updateLoading } = useUpdateFriend();

	const loading = createLoading || updateLoading;

	const [formData, setFormData] = useState<FriendFormData>({
		name: initialData?.name || '',
		image: initialData?.image || '',
		description: initialData?.description || '',
		pinned: initialData?.pinned ?? false,
		order: initialData?.order ?? 0,
		socialLinks: initialData?.socialLinks || [],
	});

	const handleAddSocialLink = () => {
		setFormData({
			...formData,
			socialLinks: [
				...formData.socialLinks,
				{ name: '', link: '', iconLight: '', iconDark: '' },
			],
		});
	};

	const handleRemoveSocialLink = (index: number) => {
		setFormData({
			...formData,
			socialLinks: formData.socialLinks.filter((_, i) => i !== index),
		});
	};

	const handleSocialLinkChange = (
		index: number,
		field: keyof SocialLink,
		value: string
	) => {
		const newSocialLinks = [...formData.socialLinks];
		newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
		setFormData({
			...formData,
			socialLinks: newSocialLinks,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (mode === 'create') {
			createFriend(formData, {
				onSuccess: () => navigate('/dashboard/friends'),
				onError: (error) => console.error('Failed to create friend:', error),
			});
		} else if (friendId) {
			updateFriend(
				{ id: friendId, data: formData },
				{
					onSuccess: () => navigate('/dashboard/friends'),
					onError: (error) => console.error('Failed to update friend:', error),
				}
			);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardContent className="space-y-6 pt-6">
					<div className="space-y-2">
						<Label htmlFor="name">名称</Label>
						<Input
							id="name"
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="输入友链名称"
							required
							value={formData.name}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="image">头像 URL</Label>
						<Input
							id="image"
							onChange={(e) =>
								setFormData({ ...formData, image: e.target.value })
							}
							placeholder="https://..."
							required
							type="url"
							value={formData.image}
						/>
						{formData.image && (
							<div className="mt-2">
								<img
									alt="头像预览"
									className="h-20 w-20 rounded-full object-cover border"
									src={formData.image}
								/>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">描述</Label>
						<Textarea
							id="description"
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="输入友链描述"
							required
							rows={3}
							value={formData.description}
						/>
					</div>

					<div className="flex items-center gap-2">
						<Checkbox
							checked={formData.pinned}
							id="pinned"
							onCheckedChange={(checked) =>
								setFormData({ ...formData, pinned: checked === true })
							}
						/>
						<Label className="cursor-pointer" htmlFor="pinned">
							置顶显示
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

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>社交链接</Label>
							<Button onClick={handleAddSocialLink} size="sm" type="button">
								<Plus className="mr-2 h-4 w-4" />
								添加链接
							</Button>
						</div>

						{formData.socialLinks.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								暂无社交链接，点击上方按钮添加
							</p>
						) : (
							<div className="space-y-4">
								{formData.socialLinks.map((link, index) => (
									<Card className="bg-muted/50" key={index}>
										<CardContent className="space-y-4">
											<div className="flex items-center justify-between mb-2">
												<h4 className="text-sm font-medium">
													链接 {index + 1}
												</h4>
												<Button
													onClick={() => handleRemoveSocialLink(index)}
													size="sm"
													type="button"
													variant="ghost"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label>平台名称*</Label>
													<Input
														onChange={(e) =>
															handleSocialLinkChange(
																index,
																'name',
																e.target.value
															)
														}
														placeholder="例：GitHub"
														required
														value={link.name}
													/>
												</div>

												<div className="space-y-2">
													<Label>链接地址*</Label>
													<Input
														onChange={(e) =>
															handleSocialLinkChange(
																index,
																'link',
																e.target.value
															)
														}
														placeholder="https://..."
														required
														type="url"
														value={link.link}
													/>
												</div>

												<div className="space-y-2">
													<Label>图标 (亮色模式)*</Label>
													<Input
														onChange={(e) =>
															handleSocialLinkChange(
																index,
																'iconLight',
																e.target.value
															)
														}
														placeholder="https://..."
														required
														type="url"
														value={link.iconLight}
													/>
												</div>

												<div className="space-y-2">
													<Label>图标 (暗色模式)*</Label>
													<Input
														onChange={(e) =>
															handleSocialLinkChange(
																index,
																'iconDark',
																e.target.value
															)
														}
														placeholder="https://..."
														required
														type="url"
														value={link.iconDark}
													/>
												</div>
											</div>

											{link.iconLight && (
												<div className="flex items-center gap-4 mt-2">
													<div className="space-y-1">
														<p className="text-xs text-muted-foreground">
															亮色预览
														</p>
														<img
															alt={`${link.name} 亮色图标`}
															className="h-6 w-6 object-contain"
															src={link.iconLight}
														/>
													</div>
													{link.iconDark && (
														<div className="space-y-1">
															<p className="text-xs text-muted-foreground">
																暗色预览
															</p>
															<img
																alt={`${link.name} 暗色图标`}
																className="h-6 w-6 object-contain"
																src={link.iconDark}
															/>
														</div>
													)}
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</div>

					<div className="flex items-center gap-4">
						<Button disabled={loading} type="submit">
							{loading ? '保存中...' : mode === 'create' ? '创建' : '保存'}
						</Button>
						<Button
							onClick={() => navigate('/dashboard/friends')}
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
