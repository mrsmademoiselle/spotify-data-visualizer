import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import type { HttpMethod } from '@sveltejs/kit';
import type { SpotifyTokenWithTimestamp, SpotifyToken } from './types/token';
import type { Locale } from '$lib/common/types/types';
import { Api } from '../api';
import {
	SpotifySearchType,
	type SpotifyPlaylistSearchResponse,
	type SpotifyPlaylistResponse,
	type SpotifyMultipleArtistResponse,
	type PlaylistTracks
} from './types/spotify-data-responses';

export class SpotifyApi extends Api {
	private SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
	private SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

	private TOKEN: SpotifyTokenWithTimestamp | undefined = undefined;
	private static spotifyApiInstance: SpotifyApi | undefined = undefined;

	private constructor() {
		super();
	}

	public static getInstance(): SpotifyApi {
		if (!SpotifyApi.spotifyApiInstance) {
			console.log('new instance');
			SpotifyApi.spotifyApiInstance = new SpotifyApi();
		}

		return SpotifyApi.spotifyApiInstance;
	}

	async getTop50PlaylistGenresForCountry(locale: Locale): Promise<string[]> {
		console.log('---------------------------');
		console.log('LOCALE', locale.fullCountryName);
		const genres: string[] = [];
		try {
			const playlistId = await this.findTop50PlaylistId(locale);

			if (!playlistId) {
				console.error(`Could not find top 50 playlist for locale ${locale?.country}`);
				return [];
			}

			const playlist: SpotifyPlaylistResponse = await this.getPlaylist(playlistId, locale);
			const artistIds: string[] = this.extractArtistIds(playlist.tracks.items);
			genres.push(...(await this.fetchGenresForArtists(artistIds)));

			return genres;
		} catch (error) {
			console.error('Error:', error);
			return [];
		}
	}

	async getAllArtist(artistIds: string[]): Promise<SpotifyMultipleArtistResponse> {
		const url = new URL(`${this.SPOTIFY_BASE_URL}/artists`);
		url.searchParams.append('ids', artistIds.join(','));

		console.log(url.toString());
		return this.get<SpotifyMultipleArtistResponse>(url);
	}

	async searchFor(
		type: SpotifySearchType,
		query: string,
		locale?: Locale
	): Promise<SpotifyPlaylistSearchResponse> {
		const url = new URL(`${this.SPOTIFY_BASE_URL}/search`);
		url.searchParams.append('q', query);
		url.searchParams.append('type', type);

		return this.get<SpotifyPlaylistSearchResponse>(url, locale);
	}

	async getPlaylist(playlistId: string, locale?: Locale): Promise<SpotifyPlaylistResponse> {
		const url = new URL(`${this.SPOTIFY_BASE_URL}/playlists/${playlistId}`);

		return this.get<SpotifyPlaylistResponse>(url, locale);
	}

	async get<T>(url: URL, locale?: Locale, method: HttpMethod = 'GET'): Promise<T> {
		if (locale) url.searchParams.append('market', locale.country);

		if (!this.isTokenValid()) {
			await this.fetchToken();
		}

		return super.fetch<T>(url, method, this.getAuthorizationHeader());
	}

	private async findTop50PlaylistId(locale: Locale): Promise<string | undefined> {
		const response: SpotifyPlaylistSearchResponse = await this.searchFor(
			SpotifySearchType.PLAYLIST,
			'Top 50',
			locale
		);
		const searchResultPlaylists = response.playlists.items;

		for (const playlist of searchResultPlaylists) {
			if (
				playlist.name.startsWith('Top 50') &&
				playlist.name.includes(locale.fullCountryName) &&
				playlist.owner.display_name === 'Spotify'
			) {
				return playlist.id;
			}
		}
		console.log('nada');
		return undefined;
	}

	private async fetchGenresForArtists(artistIds: string[]): Promise<string[]> {
		const genres: string[] = [];
		const maxIdsPerRequest = 50;

		try {
			for (let i = 0; i < artistIds.length; i += maxIdsPerRequest) {
				const end =
					i + maxIdsPerRequest <= artistIds.length ? i + maxIdsPerRequest : artistIds.length;

				console.log(`from ${i} to ${end}`);

				const chunk = artistIds.slice(i, end);

				const response: SpotifyMultipleArtistResponse = await this.getAllArtist(chunk);

				const responseGenres = response.artists.flatMap((artist) => artist.genres);
				genres.push(...responseGenres);
			}
			return genres;
		} catch (error) {
			console.error('Error fetching artist data:', error);
			return genres;
		}
	}

	private getAuthorizationHeader() {
		const headers = new Headers();
		headers.append('Authorization', `Bearer ${this.TOKEN?.access_token}`);
		headers.append('Content-Type', 'application/json');
		return headers;
	}

	private isTokenValid(): boolean {
		const now = new Date().getTime();
		return (
			this.TOKEN !== undefined &&
			now <= this.TOKEN.fetched_timestamp + this.TOKEN.expires_in * 60 * 1000
		);
	}

	private async fetchToken() {
		console.info('Fetching new token');

		const body = new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: SPOTIFY_CLIENT_ID,
			client_secret: SPOTIFY_CLIENT_SECRET
		});

		try {
			const response = await fetch(this.SPOTIFY_TOKEN_URL, {
				method: 'POST',
				body: body.toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			if (response.ok) {
				const spotify_token: SpotifyToken = await response.json();
				this.TOKEN = { fetched_timestamp: new Date().getTime(), ...spotify_token };
				console.info('Successfully fetched token');
			} else {
				throw new Error(`Failed to fetch token. Status: ${response.status}`);
			}
		} catch (error) {
			console.error('Could not fetch new token', error);
			throw error;
		}
	}

	private extractArtistIds(items: PlaylistTracks[]): string[] {
		const artistIdsSet = new Set<string>(); // set to prevent duplicates

		items.forEach((item) => {
			item.track.artists.forEach((artist) => {
				artistIdsSet.add(artist.id);
			});
		});

		return Array.from(artistIdsSet);
	}
}
