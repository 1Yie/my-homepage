import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';

import { db } from './db';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'sqlite',
	}),

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
	},

	baseURL: process.env.BETTER_BASE_URL!,
	trustedOrigins: [process.env.BETTER_AUTH_URL!],
});
