import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { prisma } from './db';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'sqlite',
	}),
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['github'],
		},
	},

	advanced: {
		useSecureCookies: false,
	},

	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},

	baseURL: 'http://localhost:3000',
	trustedOrigins: ['http://localhost:5173'],
});
