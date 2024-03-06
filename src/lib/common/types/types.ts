export interface Locale {
	country: string; // country cody in format ISO 3166-1 alpha-2
	language: string;
	locale: string;
	fullCountryName: string;
}

export interface SpotifyGenresForMarket {
	locale: Locale;
	genres: GenreCount[];
}

export interface GenreCount {
	genre: string;
	count: number;
}

export enum ButtonType {
	PRIMARY,
	OUTLINE
}
