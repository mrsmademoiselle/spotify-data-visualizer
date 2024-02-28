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
} from './types/spotify-search-response';

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
		try {
			const playlistId = await this.findTop50PlaylistId(locale);

			if (!playlistId) {
				console.error(`Could not find top50 playlist for locale ${locale?.country}`);
				return [];
			}

			const playlist: SpotifyPlaylistResponse = await this.getPlaylist(playlistId, locale);
			const artistIds: string[] = this.extractArtistIds(playlist.tracks.items);
			const genres: string[] = await this.fetchGenresForArtists(artistIds, locale);

			return genres;
		} catch (error) {
			console.error('Error:', error);
			return [];
		}
	}

	async getAllArtist(artistIds: string[], locale: Locale): Promise<SpotifyMultipleArtistResponse> {
		const url = new URL(`${this.SPOTIFY_BASE_URL}/artists`);
		url.searchParams.append('ids', artistIds.join(','));

		return this.get<SpotifyMultipleArtistResponse>(url, locale);
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

		return undefined;
	}

	private async fetchGenresForArtists(artistIds: string[], locale: Locale): Promise<string[]> {
		try {
			const response: SpotifyMultipleArtistResponse = await this.getAllArtist(artistIds, locale);
			return response.artists.flatMap((artist) => artist.genres);
		} catch (error) {
			console.error('Error fetching artist data:', error);
			return [];
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
		return items.flatMap((item) => item.track.artists.map((artist) => artist.id));
	}
}
