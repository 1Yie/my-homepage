import { db } from '../lib/db';

export interface CompletionRequest {
	mode?: 'auto' | 'chat-prefix' | 'fim';
	title?: string;
	prefix: string;
	suffix?: string;
}

export interface CompletionResult {
	mode: 'chat-prefix' | 'fim';
	text: string;
}

export interface AiConfigData {
	apiKey: string;
	apiUrl: string;
	fimEnabled: boolean;
	model: string;
}

export interface AiConfigPublic {
	hasApiKey: boolean;
	apiUrl: string;
	fimEnabled: boolean;
	model: string;
}

export interface AiConfigUpdateData {
	apiKey?: string;
	apiUrl: string;
	fimEnabled: boolean;
	model: string;
}

interface DeepSeekTextCompletionResponse {
	choices?: Array<{
		text?: string;
	}>;
}

interface DeepSeekChatCompletionResponse {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
}

export async function getAiConfig(): Promise<AiConfigData | null> {
	const config = await db.aiConfig.findFirst({ orderBy: { id: 'asc' } });
	if (!config) return null;

	return {
		apiKey: config.apiKey,
		apiUrl: config.apiUrl,
		fimEnabled: config.fimEnabled,
		model: config.model,
	};
}

export async function getAiConfigPublic(): Promise<AiConfigPublic | null> {
	const config = await getAiConfig();
	if (!config) return null;

	return {
		hasApiKey: Boolean(config.apiKey),
		apiUrl: config.apiUrl,
		fimEnabled: config.fimEnabled,
		model: config.model,
	};
}

export async function updateAiConfig(
	data: AiConfigUpdateData
): Promise<AiConfigData> {
	const existing = await db.aiConfig.findFirst({ orderBy: { id: 'asc' } });
	const apiKey = data.apiKey || existing?.apiKey || '';

	if (existing) {
		await db.aiConfig.update({
			where: { id: existing.id },
			data: {
				apiKey,
				apiUrl: data.apiUrl,
				fimEnabled: data.fimEnabled,
				model: data.model,
			},
		});
	} else {
		await db.aiConfig.create({
			data: {
				apiKey,
				apiUrl: data.apiUrl,
				fimEnabled: data.fimEnabled,
				model: data.model,
			},
		});
	}

	return {
		apiKey,
		apiUrl: data.apiUrl,
		fimEnabled: data.fimEnabled,
		model: data.model,
	};
}

export async function updateAiConfigPublic(
	data: AiConfigUpdateData
): Promise<AiConfigPublic> {
	const result = await updateAiConfig(data);
	return {
		hasApiKey: Boolean(result.apiKey),
		apiUrl: result.apiUrl,
		fimEnabled: result.fimEnabled,
		model: result.model,
	};
}

function ensureAiConfig(config: AiConfigData | null): AiConfigData {
	if (!config) {
		throw new Error(
			'AI config is not set. Please configure API settings first.'
		);
	}

	if (!config.apiKey) {
		throw new Error('API key is not configured.');
	}

	return config;
}

function trimTrailingSlash(url: string) {
	return url.replace(/\/+$/, '');
}

async function requestFimCompletion(
	config: AiConfigData,
	request: CompletionRequest
): Promise<string> {
	const response = await fetch(
		`${trimTrailingSlash(config.apiUrl)}/completions`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.apiKey}`,
			},
			body: JSON.stringify({
				model: config.model,
				prompt: request.prefix,
				suffix: request.suffix,
				max_tokens: 512,
				temperature: 0.3,
				frequency_penalty: 0.3,
				presence_penalty: 0.1,
				stop: ['\n\n\n', '\n# ', '\n## '],
			}),
		}
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`FIM completion API error: ${error}`);
	}

	const data = (await response.json()) as DeepSeekTextCompletionResponse;
	return data.choices?.[0]?.text ?? '';
}

async function requestChatPrefixCompletion(
	config: AiConfigData,
	request: CompletionRequest
): Promise<string> {
	const suffixHint = request.suffix?.trim()
		? `\n\nThe following text appears AFTER the cursor. Your continuation must connect naturally to it without repeating it:\n\n${request.suffix}\n\nGenerate only the missing content between the cursor and the text above.`
		: '';

	const messages: Record<string, unknown>[] = [
		{
			role: 'system',
			content:
				'You are a professional writer continuing a markdown article. Match the existing voice, tone, and formatting exactly. Maintain any frontmatter, heading hierarchy, list styles, code blocks, or tables present. Output ONLY raw continuation text — no explanations, no meta-commentary, no prefixes like "Here is the continuation:". Stop naturally at a paragraph or section boundary.',
		},
		{
			role: 'user',
			content: `Title: ${request.title || 'Untitled'}\n\nCurrent article:\n${request.prefix}\n\n⟐ Continue writing from the cursor. Flow naturally into the next sentence. Do not repeat existing content.${suffixHint}`,
		},
		{
			role: 'assistant',
			content: '',
			prefix: true,
		},
	];

	const response = await fetch(
		`${trimTrailingSlash(config.apiUrl)}/chat/completions`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.apiKey}`,
			},
			body: JSON.stringify({
				model: config.model,
				messages,
				max_tokens: 512,
				temperature: 0.5,
				frequency_penalty: 0.3,
				presence_penalty: 0.2,
				stop: ['\n\n\n', '\n# ', '\n## '],
			}),
		}
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Chat prefix completion API error: ${error}`);
	}

	const data = (await response.json()) as DeepSeekChatCompletionResponse;
	return data.choices?.[0]?.message?.content ?? '';
}

export async function generateCompletion(
	request: CompletionRequest
): Promise<CompletionResult> {
	const config = ensureAiConfig(await getAiConfig());
	const mode = request.mode ?? 'auto';

	if (mode === 'fim') {
		if (!config.fimEnabled) {
			throw new Error('FIM completion is disabled in AI settings.');
		}

		const text = await requestFimCompletion(config, request);
		return {
			mode: 'fim',
			text,
		};
	}

	if (mode === 'chat-prefix') {
		const text = await requestChatPrefixCompletion(config, request);
		return {
			mode: 'chat-prefix',
			text,
		};
	}

	const hasSuffix = Boolean(request.suffix?.trim());

	if (hasSuffix && config.fimEnabled) {
		const text = await requestFimCompletion(config, request);
		return {
			mode: 'fim',
			text,
		};
	}

	const text = await requestChatPrefixCompletion(config, request);
	return {
		mode: 'chat-prefix',
		text,
	};
}
