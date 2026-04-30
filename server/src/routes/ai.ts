import { Elysia, t } from 'elysia';

import { authMiddleware } from '../lib/auth-middleware';
import {
	generateCompletion,
	getAiConfig,
	updateAiConfig,
} from '../services/ai';

export const aiRoutes = new Elysia({ prefix: '/ai' })
	.use(authMiddleware)
	.post(
		'/completion',
		async ({ body }) => {
			const result = await generateCompletion(body);
			return { success: true, data: result };
		},
		{
			body: t.Object({
				mode: t.Optional(
					t.Union([
						t.Literal('auto'),
						t.Literal('chat-prefix'),
						t.Literal('fim'),
					])
				),
				title: t.Optional(
					t.String({ description: '文章标题，用于提供上下文' })
				),
				prefix: t.String({ description: '光标前的内容作为续写前缀' }),
				suffix: t.Optional(
					t.String({ description: '光标后的内容，模型续写时会避免重复' })
				),
			}),
			auth: true,
			detail: {
				description:
					'AI 内容补全接口，自动在 DeepSeek Chat Prefix Completion 与 FIM Completion 之间切换',
				tags: ['AI'],
			},
		}
	)
	.get(
		'/config',
		async () => {
			const config = await getAiConfig();
			if (!config) {
				return { success: true, data: null };
			}
			return { success: true, data: config };
		},
		{
			auth: true,
			detail: {
				description: '获取 AI 配置信息',
				tags: ['AI'],
			},
		}
	)
	.put(
		'/config',
		async ({ body }) => {
			const config = await updateAiConfig(body);
			return { success: true, data: config };
		},
		{
			body: t.Object({
				apiKey: t.String({ description: 'API Key' }),
				apiUrl: t.String({ description: 'API 地址' }),
				fimEnabled: t.Boolean({ description: '是否启用 FIM 中间补全' }),
				model: t.String({ description: '模型名称' }),
			}),
			auth: true,
			detail: {
				description: '更新 AI 配置',
				tags: ['AI'],
			},
		}
	);
