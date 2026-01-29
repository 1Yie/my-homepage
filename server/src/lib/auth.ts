import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';

import { db } from './db';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'sqlite',
	}),

	baseURL: process.env.BETTER_AUTH_URL!,
	trustedOrigins: [process.env.FRONTEND_URL!],

	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					const ADMIN_EMAIL = 'me@ichiyo.in';
					if (user.email !== ADMIN_EMAIL) {
						throw new APIError('FORBIDDEN', {
							message: 'Access denied: You are not the admin.',
						});
					}
					return { data: user };
				},
			},
		},
	},

	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['github'],
		},
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
