<script lang="ts">
	import type { SpotifyPlaylistResponse } from '$lib/common/apis/spotify/types/spotify-search-response';
	import Top50GenresPerCountry from '$lib/common/components/top-50-genres-per-country.svelte';
	import type { Locale } from '$lib/common/types/types';
	import type { PageData } from '../$types';

	export let data: PageData;

	const genresForMarket: Map<Locale, Map<string, number>> = data.genresForMarket;
</script>

{#each genresForMarket.entries() as entry}
	<Top50GenresPerCountry locale={entry[0]} genresForMarket={entry[1]} />
{/each}
