import { SpotifyApi } from '$lib/common/apis/spotify/spotify-api';
import type { Locale } from '$lib/common/types/types';
import { locales } from '$lib/common/utils/locales';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const genresForMarket = new Map<Locale, Map<string, number>>();

	try {
		const spotifyApi = SpotifyApi.getInstance();

		const countGenreDuplicates = (genres: string[]) => {
			const genreMap: Map<string, number> = new Map();

			genres.forEach((genre) => {
				genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
			});

			return genreMap;
		};

		for (const spotifyMarket of locales) {
			const genres: string[] = await spotifyApi.getTop50PlaylistGenresForCountry(spotifyMarket);

			if (genres.length) {
				const genreToAmount: Map<string, number> = countGenreDuplicates(genres);
				genresForMarket.set(spotifyMarket, genreToAmount);
			}
		}
	} catch (error) {
		console.error('Could not fetch playlist:', error);
	}

	return json(genresForMarket);
};
