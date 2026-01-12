import { PrismaLibSql } from '@prisma/adapter-libsql';

import { PrismaClient } from '../../prisma/generated/prisma/client';

const adapter = new PrismaLibSql({
	url: process.env.DATABASE_URL || 'file:./sqlite.db',
});

export const prisma = new PrismaClient({
	adapter,
	log: [
		{ level: 'query', emit: 'stdout' },
		{ level: 'error', emit: 'stdout' },
		{ level: 'info', emit: 'stdout' },
		{ level: 'warn', emit: 'stdout' },
	],
});
