import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/router';

const queryClient = new QueryClient();

// Global toast type declaration
declare global {
	interface Window {
		toast: {
			success: (message: string) => void;
			error: (message: string) => void;
			info: (message: string) => void;
			warning: (message: string) => void;
		};
	}
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
