import { SpotifyApi } from '$lib/common/apis/spotify/spotify-api';
import type { GenreCount, Locale, SpotifyGenresForMarket } from '$lib/common/types/types';
import { fullLocales } from '$lib/common/utils/locales';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	let genresForMarket: SpotifyGenresForMarket[] = [];

	// 180 requests per minute spotify rate limit

	try {
		const spotifyApi = SpotifyApi.getInstance();
		const markets = await spotifyApi.getAvailableMarkets();

		const countGenreDuplicates = (genres: string[]): GenreCount[] => {
			const genreCounts: GenreCount[] = [];

			genres.forEach((genre) => {
				const existingGenre = genreCounts.find((g) => g.genre === genre);
				if (existingGenre) {
					existingGenre.count += 1;
				} else {
					genreCounts.push({ genre, count: 1 });
				}
			});

			return genreCounts;
		};

		for (const country of markets) {
			const spotifyMarket: Locale | undefined = fullLocales.find(
				(locale) => locale.country === country
			);

			if (spotifyMarket) {
				const genres: string[] = await spotifyApi.getTop50PlaylistGenresForCountry(spotifyMarket);

				if (genres.length) {
					const genreCounts: GenreCount[] = countGenreDuplicates(genres);
					genresForMarket.push({ locale: spotifyMarket, genres: genreCounts });
				}
			}
		}

		genresForMarket = genresForMarket.map((item) => ({
			...item,
			genres: item.genres.sort((a, b) => b.count - a.count)
		}));
	} catch (error) {
		console.error('Could not fetch playlist:', error);
	}

	return json(genresForMarket);
};
