import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProgressBar } from '@/components/progress-bar';
import { ScrollToTop } from '@/components/scroll-to-top';
import {
	AnchoredToastProvider,
	ToastProvider,
	toastManager,
} from '@/components/ui/toast';

export function AppLayout() {
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
				<ScrollToTop />
				<ProgressBar />
				<Header />
				<Outlet />
				<Footer />
			</AnchoredToastProvider>
		</ToastProvider>
	);
}
