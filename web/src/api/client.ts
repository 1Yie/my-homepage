import type { App } from '@server/index';

import { treaty } from '@elysiajs/eden';
import { createAuthClient } from 'better-auth/react';

export const client = treaty<App>(import.meta.env.VITE_BASE_URL, {
	fetch: {
		credentials: 'include',
	},
});

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BASE_URL,
	fetchOptions: {
		credentials: 'include',
	},
});
