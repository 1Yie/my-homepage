import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { db } from './db';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'sqlite',
	}),

	baseURL: process.env.BETTER_BASE_URL || process.env.BETTER_AUTH_URL!,
	trustedOrigins: [process.env.FRONTEND_URL || process.env.BETTER_AUTH_URL!],

	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
	},

	advanced: {
		useSecureCookies: process.env.NODE_ENV === 'production',

		crossSubDomainCookies: {
			enabled: process.env.NODE_ENV === 'production',
		},

		defaultCookieAttributes: {
			sameSite: 'Lax',
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
		},
	},
});
