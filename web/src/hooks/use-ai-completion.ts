import { useState } from 'react';

import { client } from '@/api/client';

interface AiCompletionResult {
	mode: 'chat-prefix' | 'fim';
	text: string;
}

interface AiCompletionResponse {
	success: boolean;
	data?: AiCompletionResult;
	error?: string;
}

type AiCompletionMode = 'auto' | 'chat-prefix' | 'fim';

export function useAiCompletion() {
	const [completing, setCompleting] = useState(false);

	const complete = async (
		prefix: string,
		title?: string,
		suffix?: string,
		mode: AiCompletionMode = 'auto'
	): Promise<AiCompletionResult> => {
		setCompleting(true);
		try {
			const response = await client.api.v1.ai.completion.post({
				mode,
				prefix,
				title,
				suffix,
			});

			if (response.error) {
				throw new Error('AI 补全失败');
			}

			const apiResponse = response.data as AiCompletionResponse | null;

			if (!apiResponse?.success || !apiResponse.data) {
				throw new Error(apiResponse?.error || 'AI 补全失败');
			}

			return {
				mode: apiResponse.data.mode,
				text: apiResponse.data.text ?? '',
			};
		} finally {
			setCompleting(false);
		}
	};

	return { complete, completing };
}
