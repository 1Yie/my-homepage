import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogPanel,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSeo } from '@/hooks/use-page-meta';

export function LoginPage() {
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	const [showDemoModal, setShowDemoModal] = useState(!session);

	const demoEmail = import.meta.env.VITE_DEMO_USER_EMAIL || 'demo@ichiyo.in';
	const demoPassword = import.meta.env.VITE_DEMO_USER_PASSWORD || 'password123';

	const [email, setEmail] = useState(demoEmail);
	const [password, setPassword] = useState(demoPassword);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useSeo({
		title: '登录',
		description: '登录 / ichiyo (@1Yie)',
		keywords: ['ichiyo', '一叶'],
	});

	if (session) {
		navigate('/');
		return null;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);
		setIsSubmitting(true);

		const { error } = await authClient.signIn.email({
			email,
			password,
			rememberMe: true,
		});

		setIsSubmitting(false);

		if (error) {
			setErrorMessage(error.message || '登录失败，请重试');
			return;
		}

		navigate('/');
	};

	return (
		<>
			<Dialog onOpenChange={setShowDemoModal} open={showDemoModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>欢迎访问 Demo 演示</DialogTitle>
						<DialogDescription>
							这是一个演示站点，你可以使用以下凭据直接登录。
						</DialogDescription>
					</DialogHeader>

					<DialogPanel className="space-y-2 text-sm">
						<div className="bg-muted p-3 rounded-lg border">
							<div className="flex justify-between">
								<span className="font-semibold text-muted-foreground">
									演示账号:
								</span>
								<code className="bg-background px-1 rounded">{demoEmail}</code>
							</div>
							<div className="flex justify-between">
								<span className="font-semibold text-muted-foreground">
									演示密码:
								</span>
								<code className="bg-background px-1 rounded">
									{demoPassword}
								</code>
							</div>
						</div>

						<div className="text-xs text-muted-foreground mt-2 border-t pt-2">
							<p className="font-bold mb-1">免责声明：</p>
							<p>
								本演示环境仅供参考和功能测试，请勿上传真实或敏感数据。系统会定期清理数据，对任何意外产生的数据丢失不承担责任。
							</p>
						</div>
					</DialogPanel>

					<DialogFooter>
						<Button className="w-full" onClick={() => setShowDemoModal(false)}>
							我知道了
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* 登录卡片 */}
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">登录到 ichiyo.in</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label render={<label htmlFor="email" />}>邮箱</Label>
							<Input
								id="email"
								onChange={(event) => setEmail(event.target.value)}
								required
								type="email"
								value={email}
							/>
						</div>
						<div className="space-y-2">
							<Label render={<label htmlFor="password" />}>密码</Label>
							<Input
								id="password"
								onChange={(event) => setPassword(event.target.value)}
								required
								type="password"
								value={password}
							/>
						</div>
						{errorMessage ? (
							<p className="text-sm text-destructive">{errorMessage}</p>
						) : null}
						<Button
							className="w-full"
							disabled={isSubmitting}
							size="lg"
							type="submit"
						>
							{isSubmitting ? '登录中...' : '登录'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
