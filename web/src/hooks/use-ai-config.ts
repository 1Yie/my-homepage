import { useQuery } from '@tanstack/react-query';

import { client } from '@/api/client';

export interface AiConfig {
	apiKey: string;
	apiUrl: string;
	fimEnabled: boolean;
	model: string;
}

export function useGetAiConfig() {
	const query = useQuery<AiConfig | null>({
		queryKey: ['ai-config'],
		queryFn: async () => {
			const response = await client.api.v1.ai.config.get();
			const apiResponse = response.data as {
				success: boolean;
				data: AiConfig | null;
			};
			if (!apiResponse || !apiResponse.success) {
				throw new Error('Failed to fetch AI config');
			}
			return apiResponse.data;
		},
	});

	return {
		config: query.data ?? null,
		loading: query.isLoading,
		error: query.error?.message ?? null,
		refetch: query.refetch,
	};
}
