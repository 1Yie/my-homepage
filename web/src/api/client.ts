import type { App } from '@server/index';

import { treaty } from '@elysiajs/eden';
import { createAuthClient } from 'better-auth/react';

const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;

export const client = treaty<App>(BASE_URL, {
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
