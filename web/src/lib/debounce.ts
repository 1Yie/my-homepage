// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	delay: number
): T {
	let timeoutId: NodeJS.Timeout | null = null;

	return ((...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		return new Promise((resolve, reject) => {
			timeoutId = setTimeout(async () => {
				try {
					const result = await fn(...args);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			}, delay);
		});
	}) as T;
}
