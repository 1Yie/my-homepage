import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { authClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export function LoginPage() {
	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	// If already logged in, redirect to home
	if (session) {
		navigate('/');
		return null;
	}

	const handleGithubLogin = async () => {
		await authClient.signIn.social({ provider: 'github' });
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-background
				px-4"
		>
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">登录到 ichiyo</CardTitle>
					<CardDescription>选择你的登录方式继续</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						className="w-full"
						onClick={handleGithubLogin}
						size="lg"
						variant="outline"
					>
						<Github className="mr-2 h-5 w-5" />
						使用 GitHub 登录
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
