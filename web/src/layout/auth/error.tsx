import { AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export function AuthErrorPage() {
	const [searchParams] = useSearchParams();
	const error = searchParams.get('error') || 'Unknown error';

	const getErrorMessage = (error: string) => {
		switch (error) {
			case 'Configuration':
				return 'There is a problem with the server configuration.';
			case 'AccessDenied':
				return 'You do not have permission to sign in.';
			case 'Verification':
				return 'The verification token has expired or has already been used.';
			case 'Default':
				return 'An error occurred during authentication.';
			default:
				return 'An unknown error occurred during authentication.';
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<div
					className="mx-auto mb-4 flex h-12 w-12 items-center justify-center
						rounded-full bg-destructive/10"
				>
					<AlertTriangle className="h-6 w-6 text-destructive" />
				</div>
				<CardTitle className="text-xl">Authentication Error</CardTitle>
				<CardDescription>{getErrorMessage(error)}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-sm text-muted-foreground">
					If this problem persists, please contact support.
				</div>
				<Button className="w-full" onClick={() => window.history.back()}>
					Go Back
				</Button>
			</CardContent>
		</Card>
	);
}
