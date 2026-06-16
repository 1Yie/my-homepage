import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';

import { client } from '@/api/client';
import { DashboardHeaderTitle } from '@/components/page-title/dashboard-header-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { useGetAiConfig } from '@/hooks/use-ai-config';
import { useTitle } from '@/hooks/use-page-meta';

export function AiSettingsPage() {
	const { config, loading, refetch } = useGetAiConfig();
	const [apiKey, setApiKey] = useState('');
	const [apiUrl, setApiUrl] = useState('https://api.deepseek.com/beta');
	const [fimEnabled, setFimEnabled] = useState(true);
	const [model, setModel] = useState('deepseek-v4-pro');
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	useTitle('模型设置');

	useEffect(() => {
		if (config) {
			if (!config.hasApiKey) {
				setApiKey('');
			}
			setApiUrl(config.apiUrl);
			setFimEnabled(config.fimEnabled);
			setModel(config.model);
		}
	}, [config]);

	const handleSave = async () => {
		setSaving(true);
		setSaveError(null);
		setSaved(false);

		try {
			const response = await client.api.v1.ai.config.put({
				...(apiKey ? { apiKey } : {}),
				apiUrl,
				fimEnabled,
				model,
			});
			if (response.data?.success) {
				setSaved(true);
				refetch();
			} else {
				setSaveError('保存失败');
			}
		} catch (err) {
			setSaveError(err instanceof Error ? err.message : '保存失败');
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-center py-16">
					<Spinner size={32} />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-1 flex-col gap-4">
				<DashboardHeaderTitle
					subtitle="配置 AI 续写功能所需的 API 参数"
					title="模型设置"
				/>

				<Card>
					{/* <CardHeader>
						<span className="flex items-center gap-2 text-lg font-semibold">
							AI 续写配置
						</span>
					</CardHeader> */}
					<CardContent className="space-y-6">
						{saveError && (
							<div
								className="rounded-md bg-destructive/10 p-3 text-sm
									text-destructive"
							>
								{saveError}
							</div>
						)}
						{saved && (
							<div
								className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700
									dark:bg-emerald-950 dark:text-emerald-300"
							>
								配置已保存，现在可以前往文章编辑页体验 AI 续写功能
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="apiUrl">API 地址</Label>
							<Input
								id="apiUrl"
								onChange={(e) => setApiUrl(e.target.value)}
								placeholder="https://api.deepseek.com/beta"
								value={apiUrl}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="apiKey">API Key</Label>
							<Input
								id="apiKey"
								onChange={(e) => setApiKey(e.target.value)}
								placeholder={
									config?.hasApiKey
										? '已配置，留空则保持不变'
										: 'sk-xxxxxxxxxxxxxxxx'
								}
								type="password"
								value={apiKey}
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-4">
								<Label>FIM 中间补全</Label>

								<Switch
									checked={fimEnabled}
									onCheckedChange={(checked) => setFimEnabled(checked)}
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								FIM（Fill-In-the-Middle）是一种通过在输入文本中插入特殊标记来提示模型进行续写的技术。
								<br />
								启用后，AI 续写功能会在用户输入的文本中插入 FIM
								标记，提示模型从标记位置开始续写。
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="model">模型</Label>
							<Input
								id="model"
								onChange={(e) => setModel(e.target.value)}
								placeholder="deepseek-v4-pro"
								value={model}
							/>
							<p className="text-xs text-muted-foreground">
								可选的模型名称，具体取值请参考 API 提供方的文档说明。
							</p>
						</div>

						<div className="flex items-center gap-4">
							<Button disabled={saving} onClick={handleSave}>
								{saving ? (
									<>
										<Spinner className="mr-2" size={16} />
										保存中...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										保存配置
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
