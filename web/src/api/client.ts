import type { App } from '@server/index';

import { treaty } from '@elysiajs/eden';

export const client = treaty<App>(import.meta.env.VITE_BASE_URL || '', {
	fetch: {
		credentials: 'include',
	},
});
