import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';

import { db } from './db';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'sqlite',
	}),

	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,

			getUserInfo: async (token: { accessToken: string }) => {
				const response = await fetch('https://api.github.com/user', {
					headers: {
						Authorization: `Bearer ${token.accessToken}`,
						'User-Agent': 'ichiyo-blog',
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch user info from GitHub');
				}

				const profile = await response.json();

				const ADMIN_EMAIL = 'me@ichiyo.in';

				if (profile.email !== ADMIN_EMAIL) {
					throw new APIError('FORBIDDEN', {
						message: 'This email address is not allowed to log in.',
					});
				}

				return {
					user: {
						id: String(profile.id),
						name: profile.name || profile.login,
						email: profile.email,
						image: profile.avatar_url,
						emailVerified: true,
					},
					data: profile,
				};
			},
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

	onAPIError: {
		errorURL: '/auth/error',
	},
});
