import type { HttpMethod } from '@sveltejs/kit';

export class Api {
	public async fetch<T>(
		url: URL,
		method: HttpMethod,
		headers: Headers,
		body?: BodyInit
	): Promise<T> {
		try {
			const response = await fetch(url, {
				method: method,
				headers: headers,
				body: body
			});

			if (response.ok) {
				console.info('Successfully fetched data');
				return response.json();
			} else {
				throw new Error(`Failed to fetch data. Status: ${response.status}`);
			}
		} catch (error) {
			console.error('Fetch failed', error);
			throw error;
		}
	}
}
