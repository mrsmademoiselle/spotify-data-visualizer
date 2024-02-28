export interface SpotifyToken {
	access_token: string;
	token_type: 'Bearer';
	expires_in: number; // expiry time in minutes
}

export interface SpotifyTokenWithTimestamp extends SpotifyToken {
	fetched_timestamp: number;
}
