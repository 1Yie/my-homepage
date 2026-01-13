import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
	AnchoredToastProvider,
	ToastProvider,
	toastManager,
} from '@/components/ui/toast';

export const AuthLayout = () => {
	useEffect(() => {
		window.toast = {
			success: (message: string) => {
				toastManager.add({
					title: message,
					type: 'success',
				});
			},
			error: (message: string) => {
				toastManager.add({
					title: message,
					type: 'error',
				});
			},
			info: (message: string) => {
				toastManager.add({
					title: message,
					type: 'info',
				});
			},
			warning: (message: string) => {
				toastManager.add({
					title: message,
					type: 'warning',
				});
			},
		};
	}, []);

	return (
		<ToastProvider>
			<AnchoredToastProvider>
				<div
					className="relative flex min-h-screen items-center justify-center
						overflow-hidden bg-slate-50 dark:bg-slate-900"
				>
					<div className="pointer-events-none absolute inset-0">
						<svg
							className="h-full w-full"
							height="100%"
							width="100%"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<pattern
									height="32"
									id="auth-mesh"
									patternUnits="userSpaceOnUse"
									width="32"
								>
									<path
										className="text-slate-200 dark:text-slate-800"
										d="M 32 0 L 0 0 0 32"
										fill="none"
										stroke="currentColor"
										strokeWidth="1"
									/>
								</pattern>

								<radialGradient cx="50%" cy="50%" id="fade-mask" r="50%">
									<stop offset="0%" stopColor="white" stopOpacity="1" />
									<stop offset="100%" stopColor="white" stopOpacity="0" />
								</radialGradient>
								<mask id="mesh-mask">
									<rect fill="url(#fade-mask)" height="100%" width="100%" />
								</mask>
							</defs>

							<rect
								fill="url(#auth-mesh)"
								height="100%"
								mask="url(#mesh-mask)"
								width="100%"
							/>
						</svg>
					</div>

					<div className="relative z-10 w-full max-w-md px-4">
						<Outlet />
					</div>
				</div>
			</AnchoredToastProvider>
		</ToastProvider>
	);
};
