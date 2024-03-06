export enum SpotifySearchType {
	PLAYLIST = 'playlist',
	ALBUM = 'album',
	TRACK = 'track',
	ARTIST = 'artist',
	SHOW = 'show',
	EPISODE = 'episode',
	AUDIOBOOK = 'audiobook'
}

export interface SpotifyPlaylistSearchResponse {
	playlists: { items: PlaylistItems[] };
}

interface PlaylistItems {
	id: string;
	name: string;
	owner: { display_name: string };
}

export interface SpotifyPlaylistResponse {
	id: string;
	name: string;
	owner: { display_name: string };
	tracks: { items: PlaylistTracks[] };
}

export interface PlaylistTracks {
	track: { artists: Artist[]; id: string; name: string };
}

interface Artist {
	name: string;
	id: string;
	genres: string[];
}

export interface SpotifyArtistResponse {
	genres: string[];
	id: string;
}

export interface SpotifyMultipleArtistResponse {
	artists: SpotifyArtistResponse[];
}

export interface MarketResponse {
	markets: string[];
}
