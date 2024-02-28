import { SpotifyApi } from '$lib/common/apis/spotify/spotify-api';
import type { Locale, TopGenre } from '$lib/common/types/types';
import { locales } from '$lib/common/utils/locales';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const topGenres: TopGenre[] = [];
	const genresForMarket = new Map<Locale, Map<string, number>>();

	try {
		for (const spotifyMarket of locales) {
			const genres: string[] =
				await SpotifyApi.getInstance().getTop50PlaylistGenresForCountry(spotifyMarket);

			const countGenreDuplicates = (genres: string[]) => {
				const genreMap: Map<string, number> = new Map();

				genres.forEach((genre) => {
					if (!genreMap.has(genre)) {
						genreMap.set(genre, 1);
					} else {
						const count = genreMap.get(genre)!;
						genreMap.set(genre, count + 1);
					}
				});

				return genreMap;
			};

			const genreToAmount: Map<string, number> = countGenreDuplicates(genres);
			if (genres.length) genresForMarket.set(spotifyMarket, genreToAmount);
		}
	} catch (error) {
		console.log('could not fetch playlist', error);
	}

	return { topGenres, genresForMarket };
}
